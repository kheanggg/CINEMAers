"use client";

import React, { useState, useEffect } from "react";

interface EditMovieDetailProps {
  isVisible: boolean;
  onClose: () => void;
  movieId: number | null;
}

interface MovieDetails {
  title: string;
  posterurl: string;
  duration: number;
  rating: string;
  release_date: string;
  genre: string;
  description?: string;
}

export default function EditMovieDetail({
  isVisible,
  onClose,
  movieId,
}: EditMovieDetailProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editedMovie, setEditedMovie] = useState<MovieDetails | null>(null);
  const [isCustomRate, setIsCustomRate] = useState(false); // Toggle for custom rate input
  const [rate, setRate] = useState(""); // Stores custom rate input

  useEffect(() => {
    if (movieId !== null) {
      const fetchMovie = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/movies?id=${movieId}`);
          
          // Check if the response is ok
          if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.statusText}`);
          }

          const data = await response.json();
          setMovie(data[0]);
          setEditedMovie(data[0]); // Set edited movie to original data
        } catch (err: any) {
          setError(err.message || 'Error fetching movie data');
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [movieId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editedMovie) {
      setEditedMovie({
        ...editedMovie,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleConfirmEdit = () => {
    if (editedMovie) {
      // Handle the logic for saving the updated movie details
      console.log('Confirmed Edit:', editedMovie);
      // Make API call to save changes if necessary
    }
    onClose(); // Close the modal after saving
  };

  const handleCancelEdit = () => {
    setEditedMovie(movie); // Reset to the original movie data
    onClose(); // Close the modal without saving
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (e.target.value === "custom") {
      setIsCustomRate(true);
    } else {
      setIsCustomRate(false);
      setRate(""); // Reset custom rate when a predefined option is selected
      handleChange(e);
    }
  };

  if (!isVisible || loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[80%] max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <button className="text-white text-xl absolute top-4 right-4" onClick={onClose}>
          X
        </button>
        <div className="text-black">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : movie ? (
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="w-full sm:w-1/3 h-64 sm:h-auto mb-6 sm:mb-0 relative">
                <img
                  src={movie.posterurl}
                  alt={movie.title}
                  className="w-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <div className="gap-2 grid grid-cols-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editedMovie?.title || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Movie Release Data */}
                  <div>
                    <label htmlFor="release_date" className="block text-sm font-medium mb-1">
                      Release Date
                    </label>
                    <input
                      type="date"
                      id="release_date"
                      name="release_date"
                      value={editedMovie?.release_date || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Movie Rate */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium mb-1">
                      Movie Rating
                    </label>
                    {isCustomRate ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          id="customRate"
                          name="rating"
                          value={rate}
                          onChange={(e) => setRate(e.target.value)}
                          placeholder="Enter custom rating"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomRate(false);
                            setRate("");
                          }}
                          className="px-3 py-2 bg-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <select
                        id="rating"
                        name="rating"
                        onChange={handleRatingChange}
                        value={editedMovie?.rating || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select movie rating</option>
                        <option value="G">G - General Audience</option>
                        <option value="PG">PG - Parental Guidance Suggested</option>
                        <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                        <option value="R">R - Restricted</option>
                        <option value="NC-17">NC-17 - Adults Only</option>
                        <option value="custom">Add New Rate</option>
                      </select>
                    )}
                  </div>

                  {/* Movie Genre */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={editedMovie?.genre || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Movie Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={editedMovie?.duration || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Movie Description */}
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Movie Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editedMovie?.description || ''}
                      onChange={handleChange}
                      placeholder="Enter description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmEdit}
                      className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No movie details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
