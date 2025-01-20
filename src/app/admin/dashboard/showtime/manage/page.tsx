// src/app/admin/dashboard/showtime/manage/page.tsx
"use client";

import React, { useState } from "react";

const ManageShowtime: React.FC = () => {
  const [movies] = useState(["Movie 1", "Movie 2", "Movie 3"]); // Predefined movies
  const [filteredMovies, setFilteredMovies] = useState<string[]>(movies); // Filtered movies
  const [selectedMovie, setSelectedMovie] = useState<string>(""); // Selected or typed movie
  const [selectedCinema, setSelectedCinema] = useState<string>(""); // Selected cinema
  const [showtimeDate, setShowtimeDate] = useState<string>(""); // Date
  const [startTime, setStartTime] = useState<string>(""); // Start time

  // Handle movie input
  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSelectedMovie(input);

    // Filter the movies list based on input
    const filtered = movies.filter((movie) =>
      movie.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  // Handle movie selection
  const handleMovieSelect = (movie: string) => {
    setSelectedMovie(movie);
    setFilteredMovies(movies); // Reset filtered list
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie || !selectedCinema || !showtimeDate || !startTime) {
      alert("Please fill out all fields.");
      return;
    }

    const payload = {
      movieTitle: selectedMovie,
      cinemaId: Number(selectedCinema),
      showDate: showtimeDate,
      startTime: startTime,
    };

    console.log("Submitted Data:", payload);
    alert("Showtime added successfully!");
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl mb-6">Add Showtime</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        {/* Movie Selection/Typing */}
        <div className="relative">
          <label htmlFor="movie" className="block mb-2">
            Select or Type Movie:
          </label>
          <input
            type="text"
            id="movie"
            value={selectedMovie}
            onChange={handleMovieInputChange}
            placeholder="Type or select a movie"
            className="w-full p-2 border border-black rounded"
          />
          {/* Dropdown for filtered movies */}
          {filteredMovies.length > 0 && selectedMovie && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
              {filteredMovies.map((movie, index) => (
                <li
                  key={index}
                  onClick={() => handleMovieSelect(movie)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {movie}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cinema Selection */}
        <div>
          <label htmlFor="cinema" className="block mb-2">
            Select Cinema:
          </label>
          <select
            id="cinema"
            value={selectedCinema}
            onChange={(e) => setSelectedCinema(e.target.value)}
            className="w-full p-2 border border-black rounded"
          >
            <option value="">-- Select a Cinema --</option>
            <option value="1">Cinema 1</option>
            <option value="2">Cinema 2</option>
            <option value="3">Cinema 3</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Showtime Date */}
          <div>
            <label htmlFor="showtimeDate" className="block mb-2">
              Select Date:
            </label>
            <input
              type="date"
              id="showtimeDate"
              value={showtimeDate}
              onChange={(e) => setShowtimeDate(e.target.value)}
              className="w-full p-2 border border-black rounded"
            />
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="block mb-2">
              Select Start Time:
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-black rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Add Showtime
        </button>
      </form>
    </div>
  );
};

export default ManageShowtime;
