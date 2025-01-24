import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, showtime_id, seat, total_price } = body; // Correct field names

    const userId = parseInt(user_id); // Ensure userId is an integer
    const showtimeId = parseInt(showtime_id); // Ensure showtimeId is an integer

    console.log('Parsed body:', body); // Log the parsed body for debugging

    if (!userId || !showtimeId || !seat || total_price == null) {
      console.log('Missing required fields:', { userId, showtimeId, seat, total_price }); // Log missing fields
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    console.log('Creating booking with data:', { userId, showtimeId, seat, total_price }); // Log data before creating booking

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        showtimeId: showtimeId,
        seats: seat,
        totalPrice: total_price,
      },
    });

    console.log('Booking created:', booking); // Log the created booking for debugging

    if (!booking) {
      console.error('Booking creation failed, received null');
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json({ booking }, { status: 201 }); // Ensure payload is an object
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
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
      time: booking.showtime.start_time.toISOString().split('T')[1].slice(0, 5), // Format time
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      posterurl: booking.showtime.movie.posterurl, // Include posterurl
      showtime_id: booking.showtimeId, // Include showtime_id
      start_time: booking.showtime.start_time.toISOString(), // Include start_time
    }));

    return NextResponse.json({ bookings: formattedBookings }, { status: 200 }); // Ensure payload is an object
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}
