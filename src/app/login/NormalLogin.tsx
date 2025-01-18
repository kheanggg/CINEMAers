import React from "react";
import PasswordBox from "./passwordBox";

interface NormalLoginProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  errorEmail: string; // Separate error for email
  errorPassword: string; // Separate error for password
}

const NormalLogin: React.FC<NormalLoginProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  errorEmail,
  errorPassword,
}) => {
  return (
    <>
      <input
        type="text"
        placeholder={errorEmail || "Email"} // Show error for email if present
        className={`w-full p-2 mb-4 border rounded ${errorEmail ? "border-red-600" : ""}`}
        style={{ backgroundColor: "#2F2D2D" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <PasswordBox
        placeholder="Password"
        value={password}
        onChange={setPassword}
        error={errorPassword} // Pass password-specific error here
      />
    </>
  );
};

export default NormalLogin;
