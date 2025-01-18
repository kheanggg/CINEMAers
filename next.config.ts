import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "flagcdn.com",
      "tickets.legend.com.kh",
      "movie-platform.s3.ap-southeast-1.amazonaws.com",
    ], // Add the domain here
  },
};

export default nextConfig;
