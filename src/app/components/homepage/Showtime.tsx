"use client";

import React, { useState } from 'react';

interface DateInfo {
  dayName: string;
  day: string;
  monthName: string;
}

export default function Showtime() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Type the state

  const today = new Date();

  const formatWithLeadingZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const getDateInfo = (date: Date): DateInfo => {
    const dayName = date.toLocaleString('default', { weekday: 'long' }).toUpperCase();
    const day = formatWithLeadingZero(date.getDate());
    const monthName = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { dayName, day, monthName };
  };

  const dates: DateInfo[] = []; // Type the dates array
  for (let index = 0; index < 8; index++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + index);
    dates.push(getDateInfo(nextDate));
  }

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <style jsx>{`
        .scrollbar-hide-y::-webkit-scrollbar {
          display: none; /* Hides the scrollbar in Webkit browsers */
        }

        .scrollbar-hide-y {
          -ms-overflow-style: none; /* Hides scrollbar in IE */
          scrollbar-width: none; /* Hides scrollbar in Firefox */
        }
      `}</style>

      <div className="flex space-x-4 mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] my-12 xs:my-6 overflow-x-auto scrollbar-hide-y">
        {dates.map((dateInfo, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`xl:w-[10.25rem] lg:w-[10.25rem] md:w-[8rem] sm:w-[4.5rem] xs:w-[4rem] xs:py-0 flex flex-col flex-shrink-0 items-center justify-center 
                        rounded-lg shadow-md cursor-pointer border-2
                        ${index === selectedIndex ? 'border-red-500' : 'border-white'}`}
          >
            <span className="text-white xs:text-[11px] xs:text-[11px] md:text-[13px]">
              {dateInfo.dayName.slice(0, 3)}
            </span>
            <span className="text-white xs:text-[15px] xs:text-[20px] font-bold">
              {dateInfo.day}
            </span>
            <span className="text-white xs:text-[11px] xs:text-[11px] md:text-[13px]">
              {dateInfo.monthName.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
