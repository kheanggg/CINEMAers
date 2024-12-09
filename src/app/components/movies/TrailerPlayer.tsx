"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import ReactPlayer to disable server-side rendering
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const TrailerPlayer: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="flex justify-center items-center">
      <ReactPlayer url={url} controls width="100%" height="250px"/>
    </div>
  );
};

export default TrailerPlayer;
