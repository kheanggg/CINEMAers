import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../lib/prisma' // Adjust the path if necessary
import { z } from 'zod';

const createNewMovie = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255),
  release_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  duration: z.number().int(),
  genre: z.string().max(10),
  rating: z.string().max(25),
  posterurl: z.string().url(),
  trailerurl: z.string().url(),
});

export async function GET(request: NextRequest) {
  try {
    // Fetch movies from your Prisma database
    const movies = await prisma.movies.findMany() // Adjust the model name as per your schema

    // Return the movies in the response
    return NextResponse.json(movies)
  } catch (error) {
    // Handle errors
    console.error('Error fetching movies:', error)
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate the body using zod
  const validation = createNewMovie.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { title, description, release_date, duration, genre, rating, posterurl, trailerurl } = body;

  try {
    // Convert release_date to Date object
    const formattedReleaseDate = new Date(release_date);

    // Create new movie record in the database
    const newMovie = await prisma.movies.create({
      data: {
        title,
        description,
        release_date: formattedReleaseDate, // Use the Date object here
        duration,
        genre,
        rating,
        posterurl,
        trailerurl,
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ message: 'Error creating movie.' }, { status: 500 });
  }
}