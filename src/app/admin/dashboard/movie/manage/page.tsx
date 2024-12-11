"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Movie {
  id: string;
  title: string;
  image: string;
}

const ManageMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Fetch movies data from the API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then((res) => {
        const apiMovies = res.data.map((movie: any) => ({
          id: movie.movie_id,
          title: movie.title,
          image: movie.posterurl,
        }));
        setMovies(apiMovies);
        setFilteredMovies(apiMovies); // Set filtered movies initially
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleAddMovie = (newMovie: Movie) => {
    axios
      .post("http://localhost:3000/api/movies", newMovie)
      .then((response) => {
        // Directly update the state without re-fetching the list
        setMovies((prevMovies) => [...prevMovies, newMovie]);
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
      });
  };
  

  // Handle search query change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter movies without converting to lowercase
    const filtered = movies.filter((movie) =>
      movie.title.includes(query) // Case-sensitive search
    );
    setFilteredMovies(filtered);
  };


  // Handle edit movie
  const handleEdit = (id: string) => {
    console.log("Edit movie", id);
    // Add navigation or modal logic for editing
  };

  // Handle delete movie
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this movie?");
    if (confirmed) {
      axios
        .delete(`http://localhost:3000/api/movies/${id}`)
        .then((response) => {
          console.log("Movie deleted successfully");
          // Remove the movie from the state to update the UI
          setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
          setFilteredMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id)); // Also update filtered list
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
        });
    }
  };

  return (
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
                  <p className="text-gray-600">Some description or details about the movie can go here.</p>
                </div>

                {/* Edit/Delete Buttons */}
                <div className="ml-4 flex flex-col justify-center items-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-2"
                    onClick={() => handleEdit(movie.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(movie.id)}
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
  );
};

export default ManageMovies;
