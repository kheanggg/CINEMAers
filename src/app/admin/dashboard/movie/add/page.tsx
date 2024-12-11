"use client"

import React, { useState } from "react";

export default function Movie() {
  // State for genre and custom genre flag
  const [genre, setGenre] = useState('');
  const [isCustomGenre, setIsCustomGenre] = useState(false);
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'custom') {
      setIsCustomGenre(true);
      setGenre('');
    } else {
      setIsCustomGenre(false);
      setGenre(e.target.value);
    }
  };

  // State for rate and custom rate flag
  const [rate, setRate] = useState('');
  const [isCustomRate, setIsCustomRate] = useState(false);
  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setIsCustomRate(true);
      setRate('');
    } else {
      setIsCustomRate(false);
      setRate(selectedValue);
    }
  };

  // State for description
  const [description, setDescription] = useState('');

  return (
    <div className="text-black h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-3xl mb-4">Add Movie</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl mb-4">Movie Details</h2>
          <form className="grid grid-cols-2 gap-6">
            {/* Movie Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Movie Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie title"
              />
            </div>

            {/* Release Date */}
            <div>
              <label htmlFor="releaseDate" className="block text-sm font-medium mb-1">
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Movie Rate */}
            <div>
              <label htmlFor="rate" className="block text-sm font-medium mb-1">
                Movie Rate
              </label>
              {isCustomRate ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="rate"
                    name="rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="Enter custom rate"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomRate(false);
                      setRate('');
                    }}
                    className="px-3 py-2 bg-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  id="rate"
                  name="rate"
                  onChange={handleRateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select movie rate</option>
                  <option value="G">G - General Audience</option>
                  <option value="PG">PG - Parental Guidance Suggested</option>
                  <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                  <option value="R">R - Restricted</option>
                  <option value="NC-17">NC-17 - Adults Only</option>
                  <option value="custom">Add New Rate</option>
                </select>
              )}
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-1">
                Genre
              </label>
              {isCustomGenre ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Enter new genre"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomGenre(false);
                      setGenre('');
                    }}
                    className="px-3 py-2 bg-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  id="genre"
                  name="genre"
                  value={genre}
                  onChange={handleGenreChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select genre</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Animation">Animation</option>
                  <option value="custom">Add New Genre</option>
                </select>
              )}
            </div>

            {/* Runtime */}
            <div>
              <label htmlFor="runtime" className="block text-sm font-medium mb-1">
                Runtime (minutes)
              </label>
              <input
                type="number"
                id="runtime"
                name="runtime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter runtime"
              />
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-1">
                Rating
              </label>
              <input
                type="text"
                id="rating"
                name="rating"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie rating"
              />
            </div>

            {/* Movie Poster */}
            <div>
              <label htmlFor="poster" className="block text-sm font-medium mb-1">
                Movie Poster (PNG/JPEG)
              </label>
              <input
                type="file"
                id="poster"
                name="poster"
                accept=".png, .jpeg, .jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Movie Trailer URL */}
            <div>
              <label htmlFor="trailer" className="block text-sm font-medium mb-1">
                Movie Trailer URL
              </label>
              <input
                type="url"
                id="trailer"
                name="trailer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie trailer URL"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter movie description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4} // Adjust rows as needed
              />
            </div>
          </form>
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}