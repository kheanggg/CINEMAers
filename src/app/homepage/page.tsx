"use client";

import { useState } from "react";
import Slider from "../components/homepage/slider/Slider";
import CurrentAndUpcoming from "../components/homepage/CurrentandUpcomming";
import Showtime from "../components/homepage/Showtime";
import MovieList from "../components/homepage/MovieList";

export default function Home() {
  const [active, setActive] = useState(true); // State lifted to Home

  return (
    <div>
      <Slider />
      {/* Pass active and setActive as props */}
      <CurrentAndUpcoming active={active} setActive={setActive} />
      <Showtime />
      {/* Use active state to determine isComingSoon */}
      <MovieList isComingSoon={!active} />
    </div>
  );
}
