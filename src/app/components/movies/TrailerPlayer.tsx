"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import ReactPlayer to disable server-side rendering
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const TrailerPlayer: React.FC<{ trailerUrl: string }> = ({ trailerUrl }) => {
  return (
    <div className="flex justify-center items-center">
      {/* Pass the url prop to ReactPlayer */}
      <ReactPlayer url={trailerUrl} controls width="100%" height="500px" />
    </div>
  );
};

export default TrailerPlayer;
