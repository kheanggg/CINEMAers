import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import SeatSelection from "@/app/components/Booking/SeatSelection";
import ConfirmBooking from "../Booking/ConfirmBooking";
import SuccessfulBooking from "../Booking/SuccessfulBooking";

interface Showtime {
  location: string;
  times: { date: string; time: string }[];
}

interface MovieDetails {
  movie_id: number;
  title: string;
  posterurl: string;
}

export default function ShowTime({
  movieDetails,
}: {
  movieDetails: MovieDetails;
}) {
  const { movie_id, title, posterurl } = movieDetails;

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [cinemas, setCinemas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [showSuccessfulBooking, setShowSuccessfulBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats2] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get<{
          data: { cinema_id: number; name: string }[];
        }>(`http://localhost:3000/api/cinemas`);
        const { data } = response.data;

        const cinemaMap = data.reduce(
          (acc: { [key: number]: string }, cinema) => {
            acc[cinema.cinema_id] = cinema.name;
            return acc;
          },
          {}
        );

        setCinemas(cinemaMap);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to fetch cinemas:", err.message);
        } else {
          console.error("An unknown error occurred.");
        }
      }
    };

    fetchCinemas();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{
          data: { cinema_id: number; show_date: string; start_time: string }[];
        }>(`http://localhost:3000/api/showtime`, {
          params: { movie_id },
        });

        const { data } = response.data;

        const parsedShowtimes = data.map((item) => ({
          location: cinemas[item.cinema_id] || `Cinema ID: ${item.cinema_id}`,
          times: [
            {
              date: new Date(item.show_date).toLocaleDateString(),
              time: new Date(item.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        }));

        setShowtimes(parsedShowtimes);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch showtimes.");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(cinemas).length > 0) fetchShowtimes();
  }, [movie_id, cinemas]);

  const handleTimeSelection = (time: string, location: string) => {
    setSelectedTime(time);
    setSelectedLocation(location);
    setShowSeatSelection(true);
  };

  if (loading) return null;

  if (!showtimes || showtimes.length === 0) {
    return null;
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-8">
      <h3 className="font-thin text-3xl">Showtime</h3>
      {showtimes.length === 0 ? (
        <p>No showtime available yet</p>
      ) : (
        showtimes.map((show, index) => (
          <div key={index} className="mt-10">
            <div className="flex">
              <PlaceIcon sx={{ color: "red", fontSize: 30 }} />
              <h4 className="font-thin text-lg ml-2">{show.location}</h4>
            </div>
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-5 gap-x-5 gap-y-5 mt-5">
                {show.times.map((timeObj, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    onClick={() =>
                      handleTimeSelection(timeObj.time, show.location)
                    }
                    className="text-white border-white rounded-lg h-12 hover:bg-white/10 hover:border-white transition-colors duration-300"
                  >
                    {`${timeObj.time}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      <SeatSelection
        isVisible={showSeatSelection}
        onClose={() => setShowSeatSelection(false)}
        setShowConfirmBooking={setShowConfirmBooking}
        bookingDetails={{
          movieTitle: title,
          time: selectedTime!,
          date: "2025-01-01",
          format: "2D",
          hall: "Hall 1",
          cinema: selectedLocation!,
        }}
        setSelectedSeats2={setSelectedSeats2}
      />
      <ConfirmBooking
        isVisible={showConfirmBooking}
        onClose={() => setShowConfirmBooking(false)}
        setShowSuccessfulBooking={setShowSuccessfulBooking}
        bookingDetails={{
          movieTitle: title,
          time: selectedTime!,
          posterurl: posterurl,
          date: "2025-01-01",
          format: "2D",
          hall: "Hall 1",
          cinema: selectedLocation!,
          selectedSeats: selectedSeats,
        }}
      />
      <SuccessfulBooking
        isVisible={showSuccessfulBooking}
        onClose={() => setShowSuccessfulBooking(false)}
      />
    </div>
  );
}
