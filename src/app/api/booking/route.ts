import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/app/lib/prisma'; // Adjust the import based on your project structure

const bookingsFilePath = path.join(process.cwd(), 'data', 'bookings.json');

interface Booking {
  id: number;
  user_id: number;
  showtime_id: number;
  seat: string;
  total_price: number;
  createdAt: string;
}

async function readBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(bookingsFilePath, 'utf8');
    const bookings = JSON.parse(data);
    if (!Array.isArray(bookings)) {
      throw new Error('Bookings data is not an array');
    }
    return bookings as Booking[];
  } catch (error) {
    console.error('Error reading bookings file:', error);
    return [];
  }
}

async function writeBookings(bookings: Booking[]) {
  try {
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing bookings file:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, showtime_id, seat, total_price } = body; // Remove movie_id

    const userId = parseInt(user_id); // Ensure userId is an integer
    const showtimeId = parseInt(showtime_id); // Ensure showtimeId is an integer

    console.log('Parsed body:', body); // Log the parsed body for debugging

    if (isNaN(userId) || isNaN(showtimeId) || !seat || total_price == null) {
      console.log('Missing required fields:', { userId, showtimeId, seat, total_price }); // Log missing fields
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate showtime_id from the database
    const showtimeData = await prisma.showtime.findUnique({
      where: { showtime_id: showtimeId },
    });

    if (!showtimeData) {
      console.log(`Showtime not found for showtime_id: ${showtimeId}`);
      return NextResponse.json({ error: 'Invalid showtime_id' }, { status: 400 });
    }

    console.log('Creating booking with data:', { userId, showtimeId, seat, total_price }); // Log data before creating booking

    const bookings = await readBookings();
    const newBooking: Booking = {
      id: bookings.length + 1,
      user_id: userId,
      showtime_id: showtimeId,
      seat: seat,
      total_price: total_price,
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    await writeBookings(bookings);

    console.log('Booking created:', newBooking); // Log the created booking for debugging

    return NextResponse.json({ booking: newBooking }, { status: 201 }); // Ensure payload is an object
  } catch (error) {
    console.error('Error creating booking:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to create booking', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userId = parseInt(user_id); // Ensure userId is an integer
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    console.log(`Fetching bookings for user_id: ${userId}`);
    const bookings = await readBookings();
    console.log('All bookings:', bookings);
    const userBookings = bookings.filter((booking: Booking) => booking.user_id === userId);
    console.log('User bookings:', userBookings);

    if (userBookings.length === 0) {
      return NextResponse.json({ message: 'No bookings found for the specified user.' }, { status: 404 });
    }

    const formattedBookings = await Promise.all(userBookings.map(async (booking: Booking) => {
      const showtimeData = await prisma.showtime.findUnique({
        where: { showtime_id: booking.showtime_id },
        include: { movie: { select: { title: true, posterurl: true } } },
      });
      console.log('Fetched showtime data:', showtimeData);

      if (!showtimeData) {
        throw new Error(`Showtime data not found for showtime_id: ${booking.showtime_id}`);
      }

      return {
        id: booking.id,
        movieTitle: showtimeData.movie.title,
        date: showtimeData.show_date,
        time: showtimeData.start_time,
        seats: booking.seat,
        totalPrice: booking.total_price,
        posterurl: showtimeData.movie.posterurl,
        showtime_id: booking.showtime_id,
        start_time: showtimeData.start_time,
        user_id: booking.user_id,
      };
    }));

    return NextResponse.json({ bookings: formattedBookings }, { status: 200 }); // Ensure payload is an object
  } catch (error) {
    console.error('Error fetching bookings:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Error fetching bookings', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
