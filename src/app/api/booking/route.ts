import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { price, showtime_id, seat, total_price, user_id } = await request.json();

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(user_id),
        showtimeId: showtime_id,
        seats: seat,
        totalPrice: price, // Ensure the correct field is used for price
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error); // Log the error for debugging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return NextResponse.json({ error: 'Known error occurred while creating booking' }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      // Handle unknown Prisma errors
      return NextResponse.json({ error: 'Unknown error occurred while creating booking' }, { status: 500 });
    } else {
      // Handle other errors
      return NextResponse.json({ error: 'Error creating booking' }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: parseInt(user_id),
      },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      movieTitle: booking.showtime.movie.title,
      date: booking.showtime.show_date.toISOString().split('T')[0],
      time: booking.showtime.start_time.toISOString().split('T')[1].slice(0, 5),
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      posterurl: booking.showtime.movie.posterurl, // Include posterurl
      showtime: booking.showtime.start_time.toISOString(), // Include showtime
    }));

    return NextResponse.json(formattedBookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}
