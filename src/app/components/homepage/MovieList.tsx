import React, { useState, useEffect } from "react";
import Link from "next/link";
import SkeletonCard from "./SkeletonCard";
import Image from "next/image";

interface Movie {
  movie_id: number;
  title: string;
  posterurl: string;
  cinemas: string[];
}

interface MovieListProps {
  selectedDate: Date;
  isComingSoon: boolean;
}

interface ShowtimeData {
  movie: {
    movie_id: number;
    title: string;
    posterurl: string;
  };
  cinemas: string[];
}

interface ShowtimeResponse {
  data: ShowtimeData[];
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link
      href={`/movies/${movie.movie_id}`}
      className="flex flex-col gap-4 h-full group"
    >
      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
        <Image
          src={movie.posterurl}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-normal text-white">{movie.title}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="h-full object-cover rounded">
            <Image
              src={`/images/legend.png`}
              alt="Legend image"
              width={50}
              height={50}
              className="w-full object-cover rounded"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const MovieList = ({ selectedDate, isComingSoon }: MovieListProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (isComingSoon) {
          response = await fetch(`/api/movies?iscomingsoon=true`);
        } else {
          response = await fetch(
            `/api/showtime?show_date=${selectedDate.toISOString()}`
          );
        }

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // Handle showtime response
          const responseData = data as ShowtimeResponse;
          const movieData = responseData.data.map((showtime: ShowtimeData) => ({
            movie_id: showtime.movie.movie_id,
            title: showtime.movie.title,
            posterurl: showtime.movie.posterurl,
            cinemas: showtime.cinemas || [],
          }));
          setMovies(movieData);
          console.log(movieData);
        } else if (Array.isArray(data)) {
          // Handle direct movie response
          const movieData = (data as Movie[]).map((movie) => ({
            movie_id: movie.movie_id,
            title: movie.title,
            posterurl: movie.posterurl,
            cinemas: [],
          }));
          setMovies(movieData);
        } else {
          setError("No movies available");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedDate, isComingSoon]);

  return (
    <div className="mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px]">
      <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {loading ? (
          Array(4)
            .fill(null)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : (
          movies.map((movie) => <MovieCard key={movie.movie_id} movie={movie} />)
        )}
      </div>
    </div>
  );
};

export default MovieList;