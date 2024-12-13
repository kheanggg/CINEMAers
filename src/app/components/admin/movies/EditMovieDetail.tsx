// src/components/EditMovieModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  id: string;
  title: string;
  image: string;
  duration: number;
  rate: string;
  release_date: string;
  genre: string;
  trailerurl: string;
}

interface EditMovieModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onSave: (updatedMovie: Movie) => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ isOpen, movie, onClose, onSave }) => {
  const [editFormData, setEditFormData] = useState<Movie>({
    id: '',
    title: '',
    image: '',
    duration: 0,
    rate: '',
    release_date: '',
    genre: '',
    trailerurl: '',
  });

  useEffect(() => {
    if (movie) {
      setEditFormData(movie);
    }
  }, [movie]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/api/movies/${editFormData.id}`, editFormData)
      .then((response) => {
        onSave(editFormData); // Notify parent to update the list
        onClose(); // Close the modal
      })
      .catch((error) => {
        console.error('Error updating movie:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl mb-4">Edit Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editFormData.title}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="release_date" className="block text-gray-700">Release Date</label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              value={editFormData.release_date}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rate" className="block text-gray-700">Rating</label>
            <input
              type="text"
              id="rate"
              name="rate"
              value={editFormData.rate}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="genre" className="block text-gray-700">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={editFormData.genre}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={editFormData.duration}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="posterurl" className="block text-gray-700">Poster URL</label>
            <input
              type="text"
              id="posterurl"
              name="posterurl"
              value={editFormData.image}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="trailerurl" className="block text-gray-700">Trailer URL</label>
            <input
              type="text"
              id="trailerurl"
              name="trailerurl"
              value={editFormData.trailerurl}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;