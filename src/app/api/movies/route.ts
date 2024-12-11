import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request: Request) {
  // Get the URL search params from the request
  const url = new URL(request.url);
  const movieId = url.searchParams.get('movie_id');

  if (movieId) {
    // If movie_id is provided, use findUnique to fetch a specific movie
    try {
      const movie = await prisma.movie.findUnique({
        where: {
          movie_id: Number(movieId), // Convert movieId to a number
        },
      });

      if (!movie) {
        // If no movie is found with the provided id
        return NextResponse.json({ message: 'Movie not found.' }, { status: 404 });
      }

      // Return the found movie
      return NextResponse.json(movie);
    } catch (error) {
      // Handle any errors during fetching
      return NextResponse.json({ message: 'Error fetching movie.' }, { status: 500 });
    }
  } else {
    // If no movie_id is provided, use findMany to fetch all movies
    try {
      const movies = await prisma.movie.findMany(); // Fetch all movies
      return NextResponse.json(movies); // Return all movies
    } catch (error) {
      // Handle any errors during fetching
      return NextResponse.json({ message: 'Error fetching movies.' }, { status: 500 });
    }
  }
}