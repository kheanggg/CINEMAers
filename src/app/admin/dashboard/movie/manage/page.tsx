"use client";

import React, { useState, useEffect, Fragment } from "react";
import EditMovieDetail from "@/app/components/admin/movies/EditMovieDetail";
import DeleteMovie from "@/app/components/admin/movies/DeleteMovie";
import AlertPage from "@/app/components/AlertPage";

interface MovieDetails {
  id: number;
  title: string;
  posterurl: string;
  duration: number;
  rating: string;
  release_date: string;
  genre: string;
  description: string;
}

export default function ManageMovies() {
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<MovieDetails[]>([]);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [operationStatus, setOperationStatus] = useState<'success' | 'error' | null>(null);

  const handleSuccess = () => {
    setOperationStatus('success');
    setTimeout(() => {
      setOperationStatus(null); // Reset status after a brief delay
    }, 3000); // 3 seconds delay before resetting
  };

  const handleError = () => {
    setOperationStatus('error');
    setTimeout(() => {
      setOperationStatus(null); // Reset status after a brief delay
    }, 3000); // 3 seconds delay before resetting
  };

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        const apiMovies = data.map((movie: any) => ({
          id: movie.movie_id,
          title: movie.title,
          posterurl: movie.posterurl,
          duration: movie.duration,
          rating: movie.rating,
          release_date: movie.release_date,
          genre: movie.genre,
          description: movie.description,
        }));
        setMovies(apiMovies);
        setFilteredMovies(apiMovies); // Set filtered movies initially
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchMovies();
  }, []);

  // Handle search query change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search
    );
    setFilteredMovies(filtered);
  };

  // Handle delete movie
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/movies?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        setShowModal2(false); // Close the modal after successful delete
        handleSuccess(); // Show success message
      } else {
        handleError(); // Show error if delete fails
      }
    } catch (err) {
      console.error("Error deleting movie:", err);
      handleError();
    }
  };

  const handleEdit = async (id: number | null, movie: MovieDetails) => {
    try {
      const response = await fetch(`/api/movies?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (response.ok) {
        const updatedMovie = await response.json();
        setMovies((prevMovies) =>
          prevMovies.map((m) => (m.id === id ? updatedMovie : m))
        );
        setShowModal1(false); // Close the modal after successful edit
        handleSuccess(); // Show success message
      } else {
        handleError(); // Show error if edit fails
      }
    } catch (error) {
      console.error("Error editing movie:", error);
      handleError();
    }
  };

  return (
    <Fragment>
      <div className="text-black h-screen bg-gray-100">
        {operationStatus === 'success' && (
          <AlertPage type="success" message="Operation was successful!" />
        )}

        {operationStatus === 'error' && (
          <AlertPage type="error" message="Something went wrong!" />
        )}
        <div className="p-6">
          <h1 className="text-3xl mb-4">Manage Movies</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl">Movies List</h2>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearch}
                className="px-4 py-2 border rounded-lg w-64"
              />
            </div>
            <div className="space-y-6">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center border p-4 rounded-lg shadow-md"
                >
                  {/* Poster Image on the Left */}
                  <img
                    src={movie.posterurl}
                    alt={movie.title}
                    className="w-32 h-full object-cover mr-6 rounded-lg"
                  />

                  {/* Movie Info on the Right */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{movie.title}</h3>
                    <p className="text-gray-600">
                      Duration: {Math.floor(movie.duration / 60)} hours {movie.duration % 60} minutes
                    </p>
                    <p className="text-gray-600">Movies Rate: {movie.rating}</p>
                    <p className="text-gray-600">
                      Release Date:{" "}
                      {new Date(movie.release_date).toLocaleDateString("en-US")}
                    </p>
                    <p className="text-gray-600">Genre: {movie.genre}</p>
                  </div>

                  {/* Edit/Delete Buttons */}
                  <div className="ml-4 flex flex-col justify-center items-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 w-[75px] rounded-md hover:bg-blue-600 mb-2"
                      onClick={() => {
                        setSelectedMovieId(movie.id)
                        setShowModal1(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 w-[75px] rounded-md hover:bg-red-600"
                      onClick={() => {
                        setShowModal2(true);
                        setSelectedMovieId(movie.id)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <EditMovieDetail isVisible={showModal1} onClose={() => setShowModal1(false)} movieId={selectedMovieId} onEdit={(movie: MovieDetails) => handleEdit(selectedMovieId, movie)}/>
      <DeleteMovie isVisible={showModal2} onClose={() => setShowModal2(false)} onDelete={() => handleDelete(selectedMovieId!)} />
    </Fragment>
  );
}