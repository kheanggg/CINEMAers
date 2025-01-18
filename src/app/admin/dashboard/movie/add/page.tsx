"use client";

import React, { useState } from "react";

export default function Movie() {
  const [formData, setFormData] = useState({
    title: "",
    release_date: "",
    rating: "",
    genre: "",
    duration: "",
    posterurl: "",
    trailerurl: "",
    description: "",
  });

  const [isCustomRate, setIsCustomRate] = useState(false); // Toggle for custom rate input
  const [rate, setRate] = useState(""); // Stores custom rate input
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDuration = Number(formData.duration);
    if (isNaN(parsedDuration)) {
      alert("Duration must be a valid number.");
      return;
    }

    // Log the form data before appending it to FormData
    console.log("Form Data:", formData);
    console.log("Parsed Duration:", parsedDuration);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("release_date", formData.release_date);
    dataToSend.append("rating", formData.rating);
    dataToSend.append("genre", formData.genre);
    dataToSend.append("duration", parsedDuration.toString());
    dataToSend.append("description", formData.description);
    dataToSend.append("trailerurl", formData.trailerurl);

    if (file) {
      console.log("Poster file:", file);
      dataToSend.append("poster", file); // 'poster' is the key for the file
    }

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        body: dataToSend,
      });
      const responseData = await response.json();
      if (response.ok) {
        alert("Movie added successfully!");
      } else {
        console.error("Error:", responseData.message);
        alert(`Failed to add the movie: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the movie.");
    }
  };

  return (
    <div className="text-black h-screen bg-gray-100 flex flex-col">
      <div className="p-6 flex-grow">
        <h1 className="text-3xl mb-4">Add Movie</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl mb-4">Movie Details</h2>
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
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
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Release Date */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.release_date}
                onChange={handleChange}
              />
            </div>

            {/* Movie Rate */}
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium mb-1"
              >
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
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select movie rating</option>
                  <option value="G">G - General Audience</option>
                  <option value="PG">PG - Parental Guidance Suggested</option>
                  <option value="PG-13">
                    PG-13 - Parents Strongly Cautioned
                  </option>
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
              <select
                id="genre"
                name="genre"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.genre}
                onChange={handleChange}
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
              </select>
            </div>

            {/* Movie Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium mb-1"
              >
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            {/* Movie Poster URL (File Upload) */}
            <div>
              <label
                htmlFor="posterurl"
                className="block text-sm font-medium mb-1"
              >
                Movie Poster (PNG/JPEG)
              </label>
              <input
                type="file"
                id="posterurl"
                name="posterurl"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
              />
            </div>

            {/* Movie Trailer URL */}
            <div>
              <label
                htmlFor="trailerurl"
                className="block text-sm font-medium mb-1"
              >
                Movie Trailer URL
              </label>
              <input
                type="url"
                id="trailerurl"
                name="trailerurl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter trailer URL"
                value={formData.trailerurl}
                onChange={handleChange}
              />
            </div>

            {/* Movie Description */}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
