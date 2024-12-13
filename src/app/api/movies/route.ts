import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Adjust the path if necessary
import { z } from 'zod'; // For input validation

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
  const body = await request.json(); // Parse the request body
  console.log(body);
  const validation = createNewMovie.safeParse(body); // Validate the input using Zod schema

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  // Destructure the validated input
  const { title, description, release_date, duration, genre, rating, posterurl, trailerurl } = body;

  try {
    // Format the release_date as a JavaScript Date object
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
        posterurl,
        trailerurl,
      },
    });

    // Return the created movie as a response
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