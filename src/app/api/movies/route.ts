import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Adjust the path if necessary
import { z } from 'zod'; // For input validation
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from 'formidable';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    },
});

// Define a function to upload a file to S3
async function uploadFileToS3(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType, // Use the correct MIME type from the uploaded file
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construct the URI (URL) of the uploaded file
    const fileUri = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    // Log the URI of the uploaded file
    console.log('Uploaded file URI:', fileUri);

    return fileUri; // Return the full URL of the uploaded file
}

// Define validation schema for creating a new movie
const createNewMovie = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255),
  release_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  duration: z.number().int(),
  genre: z.string().max(10),
  rating: z.string().max(25),
  posterurl: z.string(),
  trailerurl: z.string().url(),
});

// Define validation schema for updating an existing movie
const updateMovie = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(255).optional(),
  release_date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  duration: z.number().int().optional(),
  genre: z.string().max(10).optional(),
  rating: z.string().max(25).optional(),
  posterurl: z.string().optional(),
  trailerurl: z.string().url().optional(),
});

// Handle GET requests (Fetching movies with optional filters)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters from the URL
  const id = searchParams.get('id');
  const genre = searchParams.get('genre');
  const iscomingsoon = searchParams.get('iscomingsoon');
  const title = searchParams.get('title');
  const page = parseInt(searchParams.get('page') || '1', 10); // Default to page 1
  const limit = parseInt(searchParams.get('limit') || '10', 10); // Default to limit 10
  const skip = (page - 1) * limit; // Calculate the number of records to skip for pagination

  // Dynamically build the "where" filter based on the provided query parameters
  let where: any = {};

  if (id) {
    where.movie_id = Number(id); // Filter by movie ID if provided
  }
  
  if (genre) {
    where.genre = {
      contains: genre, // Filter by genre using case-insensitive partial match
      mode: 'insensitive',
    };
  }

  if (iscomingsoon !== null && iscomingsoon !== undefined) {
    where.iscomingsoon = iscomingsoon === 'true';
  } else {
    // Handle cases where `isComingSoon` is not set
    console.log("No isComingSoon filter applied.");
  }
  

  if (title) {
    where.title = {
      contains: title, // Filter by title using case-insensitive partial match
      mode: 'insensitive',
    };
  }

  try {
    // Fetch movies from the database with filters, pagination, and limiting
    const movies = await prisma.movies.findMany({
      where,        // Apply the filters (if any)
      skip,         // Pagination: skip records based on page
      take: limit,  // Pagination: limit the number of records returned
    });

    if (movies.length === 0) {
      return NextResponse.json({ message: 'No movies found.' }, { status: 404 });
    }

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies.' }, { status: 500 });
  }
}

// Handle POST requests (Create a new movie)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const release_date = formData.get('release_date')?.toString() || '';
    const duration = parseInt(formData.get('duration')?.toString() || '0', 10);
    const genre = formData.get('genre')?.toString() || '';
    const rating = formData.get('rating')?.toString() || '';
    const trailerurl = formData.get('trailerurl')?.toString() || '';
    const poster = formData.get('poster') as File | null;

    // Validate the required fields
    if (!title || !description || !release_date || !duration || !genre || !rating) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let posterS3Url = ''; // Initialize the poster URL variable

    // If the user has uploaded a poster
    if (poster) {
      console.log('Uploading poster:', poster.name);

      // Convert file to buffer
      const buffer = Buffer.from(await poster.arrayBuffer());

      // Construct a unique file name
      const fileName = `uploads/posters/${Date.now()}-${poster.name}`;

      // Upload the poster to S3 and get the URL
      posterS3Url = await uploadFileToS3(buffer, fileName, poster.type);
    }

    // Format the release date
    const formattedReleaseDate = new Date(release_date);

    // Create a new movie in the database
    const newMovie = await prisma.movies.create({
      data: {
        title,
        description,
        release_date: formattedReleaseDate,
        duration,
        genre,
        rating,
        posterurl: posterS3Url,
        trailerurl,
      },
    });

    // Return the created movie
    return NextResponse.json(newMovie, { status: 201 });

  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ message: 'Error creating movie.' }, { status: 500 });
  }
}

// Handle PATCH requests (Update an existing movie)
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Get the movie ID from the query parameters

  if (!id) {
    return NextResponse.json({ message: 'Movie ID is required.' }, { status: 400 });
  }

  const body = await request.json(); // Parse the request body
  const validation = updateMovie.safeParse(body); // Validate the input using Zod schema

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    // If there's a release_date in the request body, format it
    const updatedData = body.release_date
      ? { ...body, release_date: new Date(body.release_date) }
      : body;

    // Update the movie in the database
    const updatedMovie = await prisma.movies.update({
      where: { movie_id: Number(id) },
      data: updatedData,
    });

    // Return the updated movie as a response
    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('Error partially updating movie:', error);
    return NextResponse.json({ message: 'Error partially updating movie.' }, { status: 500 });
  }
}

// Handle PUT requests (Update an existing movie)
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Get the movie ID from the query parameters

  if (!id) {
    return NextResponse.json({ message: 'Movie ID is required.' }, { status: 400 });
  }

  const body = await request.json(); // Parse the request body
  const validation = updateMovie.safeParse(body); // Validate the input using Zod schema

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    // If there's a release_date in the request body, format it
    const updatedData = body.release_date
      ? { ...body, release_date: new Date(body.release_date) }
      : body;

    // Update the movie in the database
    const updatedMovie = await prisma.movies.update({
      where: { movie_id: Number(id) },
      data: updatedData,
    });

    // Return the updated movie as a response
    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('Error partially updating movie:', error);
    return NextResponse.json({ message: 'Error partially updating movie.' }, { status: 500 });
  }
}

// Handle DELETE requests (Delete a movie by ID)
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Get the movie ID from the query parameters

  if (!id) {
    return NextResponse.json({ message: 'Movie ID is required.' }, { status: 400 });
  }

  try {
    // Delete the movie from the database
    await prisma.movies.delete({
      where: { movie_id: Number(id) },
    });

    // Return a success message
    return NextResponse.json({ message: 'Movie deleted successfully.' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ message: 'Error deleting movie.' }, { status: 500 });
  }
}
