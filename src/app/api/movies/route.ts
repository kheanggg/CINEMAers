import { NextResponse } from 'next/server';
import { query } from '../../lib/db'; // Adjust the path to your db module

export async function GET() {
  try {
    const result = await query('SELECT * FROM movies');
    const movies = result.rows;
    return NextResponse.json(movies); // Return the response as JSON
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 }); // Handle errors with a 500 status
  }
}


/*export async function GET(req: Request) {
  try {
    // Query a single movie by its ID (you can replace '1' with any ID to test)
    const result = await query('SELECT * FROM movies WHERE movie_id = $1', [1]);
    const movie = result.rows[0]; // Get the first movie (if exists)

    if (movie) {
      return NextResponse.json(movie); // Return the specific movie
    } else {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/
