import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star"; // Import StarIcon from Material UI
import { useSession } from "next-auth/react";

interface FavoriteButtonProps {
  movieId: number; // movieId to track which movie is being favorited
  userId: string; // userId passed from MovieDetails page
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, userId }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // Initial state for the favorite
  const { data: session } = useSession(); // Access session data

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!session) return; // Only fetch if the user is logged in

      try {
        const response = await fetch(`/api/favorite?userId=${userId}`);
        if (response.ok) {
          const favorites = await response.json();
          const isMovieFavorite = favorites.some(
            (fav: { movieId: number }) => fav.movieId === movieId
          );
          setIsFavorite(isMovieFavorite); // Update the state based on favorite status
        } else {
          console.error("Failed to fetch favorite status");
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [movieId, userId, session]);

  const toggleFavorite = async () => {
    if (!session) {
      // If no session, redirect to login using window.location
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    try {
      const response = await fetch("/api/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, userId }), // Send movieId and userId for backend processing
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite); // Update the state with response data
      } else {
        console.error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <button
      className="absolute top-1 right-2 p-0"
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <StarIcon
        style={{
          color: isFavorite ? "yellow" : "gray", // Toggle color between yellow and gray
          fontSize: "1.5rem", // Adjust the size of the icon
        }}
      />
    </button>
  );
};

export default FavoriteButton;
