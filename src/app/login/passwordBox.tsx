"use client";

import React, { useState } from "react";
import Image from "next/image";

const PasswordBox: React.FC<{
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string; // Error prop for the password field
}> = ({ placeholder, value, onChange, error }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative mt-2">
      <input
        type={passwordVisible ? "text" : "password"}
        placeholder={error || placeholder}  // Show error in placeholder if exists
        className={`w-full p-2 border rounded ${error ? "border-red-600" : ""}`}  // Apply red border if error exists
        style={{ backgroundColor: "#2F2D2D" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        style={{ background: "none", border: "none", cursor: "pointer" }}
        aria-label="Toggle password visibility"
        type="button"
      >
        {passwordVisible ? (
          <Image
            src="/login_assets/view.svg"
            alt="View password"
            width={20}
            height={20}
          />
        ) : (
          <Image
            src="/login_assets/hidden.svg"
            alt="Hide password"
            width={20}
            height={20}
          />
        )}
      </button>
    </div>
  );
};

export default PasswordBox;
