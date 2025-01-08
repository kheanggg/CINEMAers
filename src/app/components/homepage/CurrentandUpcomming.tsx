//CurrentandUpcomming.tsx
"use client";
import React from "react";

export default function CurrentAndUpcoming({
    active,
    setActive,
}: {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div className="flex xs:justify-center sm:justify-start xs:text-[20px] relative mx-auto xs:w-[360px] sm:w-[390px] md:w-[750px] lg:w-[900px] xl:w-[1125px] my-12 xs:my-9">
            <button
                onClick={() => setActive(true)}
                className={`sm:text-[20px] lg:text-[22px] ${active ? "opacity-100" : "opacity-[0.5]"
                    }`}
            >
                NOW SHOWING
            </button>
            <div className="w-1 h-auto bg-white mx-5" />
            <button
                onClick={() => setActive(false)}
                className={`sm:text-[20px] md:text-[21px] lg:text-[22px] ${!active ? "opacity-100" : "opacity-[0.5]"
                    }`}
            >
                COMING SOON
            </button>
            <span
                className={`bg-red-700 w-[5.5rem] xs:w-[4.5rem] h-1 xs:h-[2.8px] absolute bottom-[-7px] duration-300 ${active
                        ? "xl:left-[4%] lg:left-[5%] md:left-[5.5%] sm:left-[9.5%] xs:left-[15%]"
                        : "xl:left-[21%] lg:left-[26%] md:left-[29.5%] sm:left-[55%] xs:left-[65%]"
                    }`}
            ></span>
        </div>
    );
}