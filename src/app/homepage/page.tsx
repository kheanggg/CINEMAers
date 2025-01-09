"use client";
import { useState } from "react";
import Slider from "../components/homepage/slider/Slider";
import CurrentAndUpcoming from "../components/homepage/CurrentandUpcomming";
import Showtime from "../components/homepage/Showtime";
import MovieList from "../components/homepage/MovieList";

export default function Home() {
  const [active, setActive] = useState(true); // true for "Currently Showing", false for "Upcoming"
  const [selectedDate, setSelectedDate] = useState(new Date()); // Move selectedDate state up

  return (
    <div>
      <Slider />
      <CurrentAndUpcoming active={active} setActive={setActive} />
      
      {/* Only show Showtime for currently showing movies */}
      {active && (
        <Showtime 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
        />
      )}
      
      {/* MovieList will show either current or upcoming movies */}
      <MovieList 
        selectedDate={selectedDate} 
        isComingSoon={!active}
      />
    </div>
  );
}