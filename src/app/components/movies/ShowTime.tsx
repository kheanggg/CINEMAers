import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import SeatSelection from "@/app/components/Booking/SeatSelection";
import ConfirmBooking from "../Booking/ConfirmBooking";
import SuccessfulBooking from "../Booking/SuccessfulBooking";

interface Showtime {
  location: string;
  times: { date: string; time: string; hall_id: number }[];
}

interface MovieDetails {
  movie: {
    movie_id: number;
    title: string;
    posterurl: string;
    description: string;
    release_date: string;
    duration: number;
    genre: string;
    rating: string;
    trailerurl: string;
  };
  date: string;
}

const ShowTime: React.FC<{ movieDetails: MovieDetails }> = ({ movieDetails }) => {
  const { movie, date } = movieDetails; // Updated destructuring for movieDetails
  const { movie_id, title, posterurl } = movie;

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [cinemas, setCinemas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [showSuccessfulBooking, setShowSuccessfulBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [hallId, setHallId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get<{ data: { cinema_id: number; name: string }[] }>(
          `http://localhost:3000/api/cinemas`
        );
        const { data } = response.data;

        const cinemaMap = data.reduce((acc: { [key: number]: string }, cinema) => {
          acc[cinema.cinema_id] = cinema.name;
          return acc;
        }, {});

        setCinemas(cinemaMap);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch cinemas.");
      }
    };

    fetchCinemas();
  }, []);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{
          data: { cinema_id: number; hall_id: number; selected_date: string; start_time: string; movie_id: number; runtime: number }[];
        }>(`http://localhost:3000/api/showtime`, {
          params: {
            movie_id,
            selected_date: date
          },
        });

        const { data } = response.data;

        const filteredData = data.filter((item) => {
          const itemDate = new Date(item.start_time).toISOString().split("T")[0];
          return itemDate === date;
        });

        const parsedShowtimes: Showtime[] = filteredData.reduce(
          (acc: Showtime[], item) => {
            const cinemaName = cinemas[item.cinema_id] || `Cinema ID: ${item.cinema_id}`;
            const time = new Date(item.start_time).toLocaleTimeString('en-US', {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
              timeZone: "UTC",
            });

            const existingCinema = acc.find((show) => show.location === cinemaName);

            if (existingCinema) {
              existingCinema.times.push({ date: item.start_time, time, hall_id: item.hall_id });
            } else {
              acc.push({
                location: cinemaName,
                times: [{ date: item.start_time, time, hall_id: item.hall_id }],
              });
            }
            return acc;
          },
          []
        );

        setShowtimes(parsedShowtimes);
        console.log(new Date().toISOString);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch showtimes.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(cinemas).length > 0) fetchShowtimes();
  }, [movie_id, cinemas, date]);

  useEffect(() => {
    console.log('Showtimes updated:', showtimes);
  }, [showtimes]);

  const handleTimeSelection = (time: string, location: string, hall_id: number) => {
    setSelectedTime(time);
    setHallId(hall_id);
    setSelectedLocation(location);
    setShowSeatSelection(true);
  };

  if (loading) return <p>Loading...</p>;
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
            <div className="grid grid-cols-2 mt-5">
              <div className="flex gap-4">
                {show.times
                  .filter((timeObj) => new Date(timeObj.date) > new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((timeObj, i) => (
                    <Button
                      key={i}
                      variant="outlined"
                      onClick={() => handleTimeSelection(timeObj.time, show.location, timeObj.hall_id)}
                      className="text-white border-white w-[100px] rounded-lg h-12 hover:bg-white/10 hover:border-white transition-colors duration-300"
                    >
                      {timeObj.time}
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
          date,
          format: "2D",
          hall: hallId!,
          cinema: selectedLocation!,
        }}
        setSelectedSeats2={setSelectedSeats}
      />
      <ConfirmBooking
        isVisible={showConfirmBooking}
        onClose={() => setShowConfirmBooking(false)}
        setShowSuccessfulBooking={setShowSuccessfulBooking}
        bookingDetails={{
          movieTitle: title,
          time: selectedTime!,
          posterurl,
          date,
          format: "2D",
          hall: hallId!,
          cinema: selectedLocation!,
          selectedSeats,
        }}
      />
      <SuccessfulBooking
        isVisible={showSuccessfulBooking}
        onClose={() => setShowSuccessfulBooking(false)}
      />
    </div>
  );
};

export default ShowTime;
