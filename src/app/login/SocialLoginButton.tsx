"use client";

import React from "react";
import Image from "next/image";

const SocialLoginButton: React.FC<{
  provider: string;
  iconSrc: string;
  onClick: () => void;
}> = ({ provider, iconSrc, onClick }) => {
  return (
    <button
      className="w-full flex items-center relative justify-center rounded hover:underline mt-5"
      style={{
        backgroundColor: "#2F2D2D",
        padding: "10px",
        borderRadius: "20px",
      }}
      onClick={onClick}
    >
      <div className="absolute left-5">
        <Image src={iconSrc} alt={`${provider} icon`} width={20} height={20} />
      </div>
      <span className="flex-grow text-center">Continue with {provider}</span>
    </button>
  );
};

export default SocialLoginButton;
