import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Ensure Prisma client is imported correctly

export async function POST(request: NextRequest) {
  try {
    const { movieId, userId } = await request.json(); // Get movieId and userId from the request body

    // Ensure that movieId and userId are valid
    if (!movieId || !userId) {
      return NextResponse.json({ message: 'Movie ID and User ID are required' }, { status: 400 });
    }

    // Check if the favorite exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId: Number(userId), // Ensure it's a number
          movieId: Number(movieId), // Ensure it's a number
        },
      },
    });

    if (existingFavorite) {
      // Remove the favorite if it exists
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ isFavorite: false }); // Updated favorite status
    } else {
      // Add the movie to the favorites
      await prisma.favorite.create({
        data: {
          userId: Number(userId),
          movieId: Number(movieId),
        },
      });
      return NextResponse.json({ isFavorite: true }); // Updated favorite status
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Ensure that userId is valid
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Fetch all favorite movies for the given user
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: Number(userId),
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}