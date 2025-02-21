"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';  // Importing the useParams and useRouter hooks from next/navigation
import { MovieDetail } from '../../../components/movies/MovieDetail';  // Importing MovieDetail component
import Footer from '@/app/components/homepage/slider/footer/Footer';  // Importing Footer component
import MovieDetailSkeleton from '../../../components/movies/MovieDetailSkeleton';  // Importing MovieDetailSkeleton component

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
  const params = useParams();
  const id = params?.id as string;
  const date = params?.date as string;
  const [movie, setMovie] = useState<Movie | null>(null); // State to store movie data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Ensure 'date' is a valid string
  const movieDate = date && typeof date === 'string' ? date : '';

  useEffect(() => {
    if (!id) return; // Don't fetch if there's no movie ID in the URL

    const fetchMovie = async () => {
      try {
        // Simulate a delay for testing purposes
        // await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch(`/api/movies?id=${id}`);
        const text = await response.text(); // Get the raw response text
        console.log("API response:", text); // Log the raw response text

        if (!response.ok) {
          throw new Error('Movie not found');
        }

        const movieData: Movie[] = JSON.parse(text); // Parse the response text as JSON
        console.log("Movie data:", movieData); // Log movie data for debugging
        setMovie(movieData[0]); // Set the first movie from the fetched data
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error("Error fetching movie details:", err); // Log the error
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchMovie();
  }, [id]);  // The effect depends on the 'id' param

  if (error) {
    return <p>{error}</p>; // Show error message if fetching fails
  }

  return (
    <div>
      <div className="lg:flex justify-between items-center mx-auto xs:w-10/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12">
        {/* Additional content can go here */}
      </div>
      <div className="mt-[90px]">
        {loading ? (
          <MovieDetailSkeleton />
        ) : (
          movie && <MovieDetail movie={movie} date={movieDate} />
        )}
      </div>
      <Footer /> {/* Footer component */}
    </div>
  );
};

export default MovieDetails;
