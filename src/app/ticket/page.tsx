"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function Ticket() {
  const { data: session } = useSession();
  const user_id = session?.user?.id;
  interface Booking {
    id: string;
    movieTitle: string;
    date: string;
    time: string;
    seats: string;
    totalPrice: number;
    posterurl: string;
    showtimeId: number; // Add showtime_id to the Booking interface
    start_time: string; // Add start_time to the Booking interface
  }

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user_id) {
      fetch(`/api/booking?user_id=${user_id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(async data => {
          const bookingsWithStartTime = await Promise.all(data.map(async (booking: Booking) => {
            const showtimeResponse = await fetch(`/api/showtime?showtime_id=${booking.showtimeId}`);
            const showtimeData = await showtimeResponse.json();
            return { ...booking, start_time: showtimeData.start_time }; // Use full start_time
          }));
          setBookings(bookingsWithStartTime);
        })
        .catch(error => console.error('Error fetching bookings:', error));
    }
  }, [user_id]);

  const getTimeLeft = (showtime: { start_time: string }) => {
    const now = dayjs();
    const showtimeDate = dayjs(showtime.start_time);
    if (now.isAfter(showtimeDate)) {
      return 'Expired';
    }
    const duration = showtimeDate.diff(now, 'minute');
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] pt-24">
      <h5 className="text-center text-2xl mb-12">Tickets List</h5>
      <div className="flex gap-4 w-full flex-col">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="p-4 bg-[#151414] rounded-lg shadow-lg grid grid-cols-[12%_78%_10%] gap-0">
              <div className="col-span-1 my-auto">
                <Image src={booking.posterurl} alt={booking.movieTitle} width={100} height={150} className="rounded-md my-auto" />
              </div>
              <div className="col-span-1 flex flex-col justify-between my-auto">
                <div>
                  <h5 className="text-lg font-bold">{booking.movieTitle}</h5>
                  <p className="text-sm text-gray-400">{booking.date} | {booking.start_time}</p> {/* Use formatted start_time */}
                  <p className="text-sm">Seats: {booking.seats}</p>
                  <p className="text-sm">Total Price: ${booking.totalPrice}</p>
                </div>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="text-sm text-red-500 text-center">
                  {getTimeLeft({ start_time: booking.start_time })} {/* Pass start_time */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
