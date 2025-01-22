"use client";
import React from "react";
import Skeleton from "@mui/material/Skeleton";

const MovieDetailSkeleton: React.FC = () => {
  return (
    <div className="items-center justify-center mx-auto my-12 xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px]">
      <div className="flex items-center justify-center">
        <div className="grid lg:grid-cols-[20%_35%_45%] xl:grid-cols-[20%_35%_45%] md:grid-cols-[35%_65%] gap-0 w-full">
          <div className="xs:hidden sm:block relative">
            <Skeleton variant="rectangular" width="100%" height={375} style={{ backgroundColor: "#444", borderRadius: "10px" }} />
          </div>

          <div className="grid lg:grid-cols-1 xs:grid-cols-[55%_45%] sm:grid-cols-[55%_45%] xs:gap-2 lg:gap-8 ml-6 xs:ml-0 xs:mb-5 lg:ml-10 xs:justify-between sm:justify-center xs:order-2 md:order-3 md:col-span-3 xl:col-span-1">
            <Skeleton variant="text" width="80%" height={40} style={{ backgroundColor: "#444", borderRadius: "5px", marginBottom: "10px" }} />
            <Skeleton variant="text" width="60%" height={40} style={{ backgroundColor: "#444", borderRadius: "5px", marginBottom: "10px" }} />
            <Skeleton variant="text" width="70%" height={40} style={{ backgroundColor: "#444", borderRadius: "5px", marginBottom: "10px" }} />
            <Skeleton variant="text" width="50%" height={40} style={{ backgroundColor: "#444", borderRadius: "5px", marginBottom: "10px" }} />
          </div>

          <div className="flex items-start space-x-5 md:col-span-2 lg:col-span-1 md:mb-5 lg:order-3 xs:order-2 md:order-1 md:ml-5">
            <Skeleton variant="rectangular" width="100%" height={200} style={{ backgroundColor: "#444", borderRadius: "10px" }} />
          </div>

          <div className="my-5 md:col-span-3 xs:order-0 md:order-2 lg:order-4">
            <Skeleton variant="text" width="30%" height={40} style={{ backgroundColor: "#444", borderRadius: "5px", marginBottom: "10px" }} />
            <Skeleton variant="rectangular" width="100%" height={400} style={{ backgroundColor: "#444", borderRadius: "10px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;
