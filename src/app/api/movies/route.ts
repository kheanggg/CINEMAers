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

export async function POST() {
  try {
    return NextResponse.json({ message: 'Success'}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    return NextResponse.json({ message: 'Success'}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}