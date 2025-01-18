"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SkeletonCard from "../components/homepage/SkeletonCard";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Movie {
  movie_id: number;
  title: string;
  posterurl: string;
  description: string;
  release_date: string;
  duration: number;
  genre: string;
  rating: string;
  trailerurl: string;
  iscomingsoon?: boolean;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  if (!movie) {
    return <div>Movie data is not available</div>;
  }

  return (
    <Link
      href={`/movies/${movie.movie_id}`}
      className="flex flex-col gap-4 h-full group"
    >
      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
        <Image
          src={movie.posterurl}
          alt={movie.title}
          width={500} // Replace with appropriate dimensions
          height={750} // Replace with appropriate dimensions
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
              src="/images/legend.png"
              alt="cinema"
              width={500} // Replace with appropriate dimensions
              height={750} // Replace with appropriate dimensions
              className="w-full object-cover rounded"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const FavoriteMovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      setLoading(true);
      setError(null);

      if (!session) {
        setError("You must be logged in to view your favorite movies.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Fetch favorite movie IDs
        const response = await fetch(`/api/favorite?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch favorite movie IDs.");
        }

        const favoriteMovieIds = await response.json();
        console.log("Favorite Movie IDs:", favoriteMovieIds);

        // Process movie IDs
        const movieIds = Array.isArray(favoriteMovieIds)
          ? favoriteMovieIds.map((movie: { movieId: number }) => movie.movieId)
          : [favoriteMovieIds.movieId];
        console.log("Processed Movie IDs:", movieIds);

        // Step 2: Fetch movie details
        const movieDetailsPromises = movieIds.map(async (movieId: number) => {
          const movieResponse = await fetch(`/api/movies?id=${movieId}`);
          if (!movieResponse.ok) {
            throw new Error(
              `Failed to fetch details for movie with ID ${movieId}`
            );
          }
          const movieData = await movieResponse.json();
          return movieData;
        });

        const movieDetails = await Promise.all(movieDetailsPromises);
        console.log("Raw movie details:", movieDetails);

        // Flatten the double-nested array and extract the movie objects
        const flattenedMovies = movieDetails
          .flat()
          .flat()
          .filter(
            (movie) => movie && typeof movie === "object" && "movie_id" in movie
          );

        console.log("Flattened movies:", flattenedMovies);
        setMovies(flattenedMovies);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An unknown error occurred.");
          console.error("Error fetching favorite movies:", err.message);
        } else {
          setError("An unknown error occurred.");
          console.error("Error fetching favorite movies:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [session]);

  return (
    <div className="mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] pt-24">
      <h5 className="text-center text-2xl mb-12">Favorite Movies</h5>
      <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {loading ? (
          Array(4)
            .fill(null)
            .map((_, index) => <SkeletonCard key={index} />)
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center text-white">
            You haven&apos;t add any movie to favortie yet!
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoriteMovieList;
