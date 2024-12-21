"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SkeletonCard from './SkeletonCard';

// Define Movie interface to match both static and dynamic data structures
interface Movie {
  movie_id: number;
  title: string;
  posterurl: string;
  cinemas: string[];  // Assuming this is an array of strings
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link href={`/movies/${movie.movie_id}`} className="flex flex-col gap-4 h-full group">
      <div className="relative flex-1 w-full overflow-hidden rounded-xl">
        <img 
          src={movie.posterurl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-normal text-white">{movie.title}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="h-full object-cover rounded">
            <img 
              src={`/images/legend.png`} 
              className="w-full object-cover rounded"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const MovieList = ({ isComingSoon }: { isComingSoon: boolean }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // Start loading state
      try {
        const response = await fetch(`/api/movies?iscomingsoon=${isComingSoon}`);
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false); // Stop loading state
      }
    };
  
    fetchMovies();
  }, [isComingSoon]); // Fetch data whenever isComingSoon changes

  return (
    <div className="mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px]">
      <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {loading ? (
          Array(4).fill(null).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieList;
