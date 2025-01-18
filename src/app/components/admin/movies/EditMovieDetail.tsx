"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MovieDetails } from "@/app/types";

interface EditMovieDetailProps {
  isVisible: boolean;
  onClose: () => void;
  movieId: number | null;
  onEdit: (movie: MovieDetails) => Promise<void>; // Allow async function here
}

// interface MovieDetails {
//   id: number;
//   title: string;
//   posterurl: string;
//   duration: number;
//   rating: string;
//   release_date: string;
//   genre: string;
//   description: string;
// }

export default function EditMovieDetail({
  isVisible,
  onClose,
  onEdit,
  movieId,
}: EditMovieDetailProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editedMovie, setEditedMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    if (movieId !== null && movieId !== undefined) {
      const fetchMovie = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/movies?id=${movieId}`);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch movie details: ${response.statusText}`
            );
          }

          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            setMovie(data[0]);
            setEditedMovie(data[0]);
          } else {
            throw new Error("No movie data found.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error fetching movie data");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    }
  }, [movieId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (editedMovie) {
      setEditedMovie({
        ...editedMovie,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleConfirmEdit = () => {
    if (editedMovie) {
      console.log(editedMovie);
      onEdit(editedMovie);
    }
    onClose();
  };

  const handleCancelEdit = () => {
    setEditedMovie(movie);
    onClose();
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!isVisible || loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[80%] max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <button
          className="text-white text-xl absolute top-4 right-4"
          onClick={onClose}
        >
          X
        </button>
        <div className="text-black">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : movie ? (
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="w-full sm:w-1/3 h-64 sm:h-auto mb-6 sm:mb-0 relative">
                <Image
                  src={movie.posterurl}
                  alt={movie.title}
                  className="w-full object-cover rounded-lg shadow-md"
                  width={500} // Specify width for optimization
                  height={750} // Specify height for optimization
                />
              </div>
              <div className="w-full sm:w-2/3">
                <div className="gap-2 grid grid-cols-2">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editedMovie?.title || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="release_date"
                      className="block text-sm font-medium mb-1"
                    >
                      Release Date
                    </label>
                    <input
                      type="date"
                      id="release_date"
                      name="release_date"
                      value={
                        editedMovie?.release_date
                          ? formatDate(editedMovie.release_date)
                          : ""
                      }
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium mb-1"
                    >
                      Rating
                    </label>
                    <input
                      type="text"
                      id="rating"
                      name="rating"
                      value={editedMovie?.rating || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="genre"
                      className="block text-sm font-medium mb-1"
                    >
                      Genre
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={editedMovie?.genre || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium mb-1"
                    >
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={editedMovie?.duration || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-1"
                    >
                      Movie Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editedMovie?.description || ""}
                      onChange={handleChange}
                      placeholder="Enter description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleConfirmEdit}
                      className="bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md"
                    >
                      Cancel
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
