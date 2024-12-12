"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use useParams from next/navigation

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

const MovieDetail = () => {
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
      } catch (err) {
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
    <div className="movie-detail">
      <img src={movie.posterurl} alt={movie.title} className="movie-poster" />
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> {movie.duration} minutes</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Rating:</strong> {movie.rating}</p>
      <a href={movie.trailerurl} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
    </div>
  );
};

export default MovieDetail;
