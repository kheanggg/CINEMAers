// MovieTitle.tsx
import React from 'react';

interface MovieTitleProps {
  title: string;
}

const MovieTitle: React.FC<MovieTitleProps> = ({ title }) => {
  return (
    <h1 className="sm:text-3xl xs:text-2xl font-thin">
      {title}
    </h1>
  );
};

export default MovieTitle;
