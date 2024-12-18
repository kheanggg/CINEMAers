"use client";

import React, { useState, useEffect, Fragment } from "react";
import EditMovieDetail from "@/app/components/admin/movies/EditMovieDetail";

interface Movie {
  id: number;
  title: string;
  image: string;
  duration: number;
  rating: string;
  release_date: string;
  genre: string;
}

export default function ManageMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        const apiMovies = data.map((movie: any) => ({
          id: movie.movie_id,
          title: movie.title,
          image: movie.posterurl,
          duration: movie.duration,
          rating: movie.rating,
          release_date: movie.release_date,
          genre: movie.genre,
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
      movie.title.includes(query) // Case-sensitive search
    );
    setFilteredMovies(filtered);
  };

  // Handle delete movie
  const handleDelete = (id: string) => {
  };

  return (
    <Fragment>
      <div className="text-black h-screen bg-gray-100">
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
                    src={movie.image}
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
                        setSelectedMovieId(movie.id); // Set the selected movie ID
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 w-[75px] rounded-md hover:bg-red-600"
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
      <EditMovieDetail isVisible={showModal} onClose={() =>setShowModal(false)} movieId={selectedMovieId}/>
    </Fragment>
  );
}