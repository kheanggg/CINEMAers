"use client";
import React from "react";
import TrailerPlayer from "./TrailerPlayer";
import MovieDescription from "./MovieDescription";
import MovieTitle from "./MovieTitle";
import ShowTime from "./ShowTime";
import CommentSection from "./CommentSection";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import { useSession } from "next-auth/react";
interface Movie {
  movie_id: number;
  title: string;
  posterurl: string;
  description: string;
  release_date: string;
  duration: number;
  genre: string;
  rating: string;
  trailerurl: string;
}

interface MovieDetailProps {
  movie: Movie;
  date: string;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ movie, date }) => {
  const {
    movie_id,
    title,
    posterurl,
    duration,
    description,
    release_date,
    genre,
    rating,
    trailerurl,
  } = movie;
  const { data: session } = useSession();
  
  return (
    <div className="items-center justify-center mx-auto my-12 xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px]">
      <div className="flex items-center justify-center">
        <div className="grid lg:grid-cols-[20%_35%_45%] xl:grid-cols-[20%_35%_45%] md:grid-cols-[35%_65%] gap-0 w-full">
          <div className="xs:hidden sm:block relative">
            <div className="h-full object-cover rounded">
              <Image
                src={posterurl}
                alt={`Poster for ${title}`}
                className="object-cover rounded-xl"
                layout="responsive"
                width={500}
                height={750}
              />
              <FavoriteButton
                movieId={movie_id}
                userId={session?.user?.id ?? ""}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-1 xs:grid-cols-[55%_45%] sm:grid-cols-[55%_45%] xs:gap-2 lg:gap-8 ml-6 xs:ml-0 xs:mb-5 lg:ml-10 xs:justify-between sm:justify-center xs:order-2 md:order-3 md:col-span-3 xl:col-span-1">
            {/* Movie Details */}
            <div className="flex items-center">
              <div className="w-7 justify-center">
                {/* Duration Icon */}
              </div>
              <span className="text-Gray mx-1">Duration:</span>
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <div className="w-7">
                {/* Rating Icon */}
              </div>
              <span className="text-Gray mx-1">Movie Rate:</span>
              <span>{rating}</span>
            </div>
            <div className="flex items-center">
              <div className="w-7">
                {/* Release Date Icon */}
              </div>
              <span className="text-Gray mx-1">Release Date:</span>
              <span>{release_date}</span>
            </div>
            <div className="flex items-center">
              <div className="w-7">
                {/* Genre Icon */}
              </div>
              <span className="text-Gray mx-1">Genre:</span>
              <span className="uppercase">{genre}</span>
            </div>
          </div>
          <div className="flex items-start space-x-5 md:col-span-2 lg:col-span-1 md:mb-5 lg:order-3 xs:order-2 md:order-1 md:ml-5">
            <div className="bg-white w-1 h-full"> {/* White Bar */}</div>
              <MovieDescription description={description} />
            </div>
          <div className="my-5 md:col-span-3 xs:order-0 md:order-2 lg:order-4">
            <MovieTitle title={title} />
            <TrailerPlayer trailerUrl={trailerurl} />
          </div>
        </div>
      </div>

      {/* ShowTime and Comment Section */}
      <div>{date}</div>
      <ShowTime movieDetails={{ movie, date }} />
      <div className="mt-10">
        <CommentSection/>
      </div>
    </div>
  );
};