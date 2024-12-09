"use client"

import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SideNav = () => {
  // Define openSections state with a more general type for keys
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    movie: true,
    showtime: true,
    advertisement: true,
    cinemabranch: true
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="h-screen w-64 bg-[#EAE8E8] text-black p-4 shadow-lg">
      <nav>
        <h1 className="text-3xl text-center my-5">CINEMAers</h1>
        {/* Movies Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("movie")}
            className="flex justify-between items-center w-full text-left font-bold text-lg p-2 hover:bg-[#ded9d6] rounded-md"
          >
            Movies
            {openSections.movie ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </button>
          {openSections.movie && (
            <ul className="ml-4 mt-2 space-y-2">
              <li className="hover:underline cursor-pointer">Add Movie</li>
              <li className="hover:underline cursor-pointer">Remove Movie</li>
            </ul>
          )}
        </div>

        {/* Showtime Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("showtime")}
            className="flex justify-between items-center w-full text-left font-bold text-lg p-2 hover:bg-[#ded9d6] rounded-md"
          >
            Showtime
            {openSections.showtime ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </button>
          {openSections.showtime && (
            <ul className="ml-4 mt-2 space-y-2">
              <li className="hover:underline cursor-pointer">Add Showtime</li>
              <li className="hover:underline cursor-pointer">Manage Showtime</li>
            </ul>
          )}
        </div>

        {/* Advertisement Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("advertisement")}
            className="flex justify-between items-center w-full text-left font-bold text-lg p-2 hover:bg-[#ded9d6] rounded-md"
          >
            Advertisement
            {openSections.advertisement ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </button>
          {openSections.advertisement && (
            <ul className="ml-4 mt-2 space-y-2">
              <li className="hover:underline cursor-pointer">Add Advertiesment</li>
              <li className="hover:underline cursor-pointer">Manage Advertisement</li>
            </ul>
          )}
        </div>

        {/* Cinema Branch Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("cinemabranch")}
            className="flex justify-between items-center w-full text-left font-bold text-lg p-2 hover:bg-[#ded9d6] rounded-md"
          >
            Cinema Branch
            {openSections.cinemabranch ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </button>
          {openSections.cinemabranch && (
            <ul className="ml-4 mt-2 space-y-2">
              <li className="hover:underline cursor-pointer">Add Branch</li>
              <li className="hover:underline cursor-pointer">Manage Branch</li>
            </ul>
          )}
        </div>

        {/* Settings Section */}
        <div>
          <h3 className="font-bold text-lg p-2">Settings</h3>
          <ul className="ml-4 mt-2 space-y-2">
            <li className="hover:underline cursor-pointer">Profile</li>
            <li className="hover:underline cursor-pointer">Account</li>
            <li className="hover:underline cursor-pointer">Logout</li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideNav;
