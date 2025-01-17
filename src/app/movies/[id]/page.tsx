"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MovieDetail } from '../../components/movies/MovieDetail';
import Footer from '@/app/components/homepage/slider/footer/Footer';

// Define Movie interface to match the detailed data structure
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
}

const MovieDetails = () => {
  const { id } = useParams(); // Access the 'id' param from the URL
  const [movie, setMovie] = useState<Movie | null>(null); // State to store movie data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!id) return; // Don't run the fetch if there's no movie ID in the URL

    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies?id=${id}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const movieData: Movie[] = await response.json(); // Expecting an array of movies
        console.log("Movie data:", movieData); // Log movie data
        setMovie(movieData[0]); // Set movie data, taking the first element of the array
      } catch {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!movie) {
    return <p>Movie not found</p>;
  }

  return (
    <div>
      <div className=" lg:flex justify-between items-center mx-auto xs:w-10/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12">
      </div>
      <div className="mt-[90px]">
        <MovieDetail movie={movie} />
      </div>
      <Footer/>
    </div>
  );
};

export default MovieDetails;
