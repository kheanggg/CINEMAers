import Slider from "../components/homepage/slider/Slider";
import CurrentandUpcomming from "../components/homepage/CurrentandUpcomming";
import Showtime from "../components/homepage/Showtime";
import MovieList from "../components/homepage/MovieList"

export default function Home() {

  return (
    <div>
      <Slider/>
      <CurrentandUpcomming/>
      <Showtime/>
      <MovieList/>
    </div>
  );
}