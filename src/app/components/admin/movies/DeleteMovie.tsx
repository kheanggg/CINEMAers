import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface DeleteMovieProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteMovie({ isVisible, onClose, onDelete }: DeleteMovieProps) {
  return isVisible ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-black">Are you sure you want to delete this movie?</h2>
          <div className="flex justify-center gap-4">
            <button
              className="confirm-button bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={() => {
                onDelete(); // Trigger the delete function
                onClose(); // Close the modal
              }}
            >
              Confirm Delete
            </button>
            <button
              className="cancel-button bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
