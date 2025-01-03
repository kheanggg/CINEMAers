import React, { useState } from "react";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import SeatSelection from "@/app/components/Booking/SeatSelection";
import ConfirmBooking from "../Booking/ConfirmBooking";
import SuccessfulBooking from "../Booking/SuccessfulBooking";

interface Showtime {
  location: string;
  times: string[];
}

interface MovieDetails {
  movie_id: number;
  title: string;
  posterurl: string;
  duration: number;
  genre: string;
}

export default function ShowTime({ movieDetails }: { movieDetails: MovieDetails }) {
  const { movie_id, title, posterurl, duration, genre } = movieDetails;

  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showConfirmBooking, setShowConfirmBooking] = useState(false);
  const [showSuccessfulBooking, setShowSuccessfulBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats2] = useState<{ [key: string]: boolean }>({});

  const showtimes: Showtime[] = [
    {
      location: "AEON MALL MEANCHEY (LEGEND CINEMA)",
      times: Array.from({ length: 10 }, (_, i) => `12:${10 + i}`),
    },
    {
      location: "THE OLYMPIA MALL (LEGEND CINEMA)",
      times: Array.from({ length: 7 }, (_, i) => `14:${10 + i}`),
    },
    {
      location: "SHOPPING SORYA CENTER (MAJOR CINEPLEX)",
      times: Array.from({ length: 5 }, (_, i) => `16:${10 + i}`),
    },
  ];

  const handleTimeSelection = (time: string, location: string) => {
    setSelectedTime(time);
    setSelectedLocation(location);
    setShowSeatSelection(true);
  };

  return (
    <div className="my-8">
      <h3 className="font-thin text-3xl">Showtime</h3>
      {showtimes.map((show, index) => (
        <div key={index} className="mt-10">
          <div className="flex">
            <PlaceIcon sx={{ color: "red", fontSize: 30 }} />
            <h4 className="font-thin text-md ml-2">{show.location}</h4>
          </div>
          <div className="grid grid-cols-2">
            <div className="grid grid-cols-5 gap-x-5 gap-y-5 mt-5">
              {show.times.map((time, i) => (
                <Button
                  key={i}
                  variant="outlined"
                  onClick={() => handleTimeSelection(time, show.location)}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ))}

      <SeatSelection
        isVisible={showSeatSelection}
        onClose={() => setShowSeatSelection(false)}
        setShowConfirmBooking={setShowConfirmBooking}
        bookingDetails={{
          movieTitle: title,
          time: selectedTime!,
          date: "2025-01-01", // Example static date; replace with dynamic value
          format: "2D", // Example format; replace as needed
          hall: "Hall 1", // Example hall; replace as needed
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
          date: "2025-01-01", // Example static date; replace with dynamic value
          format: "2D", // Example format; replace as needed
          hall: "Hall 1", // Example hall; replace as needed
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
