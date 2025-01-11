import React from "react";
import PasswordBox from "./passwordBox";

interface NormalLoginProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const NormalLogin: React.FC<NormalLoginProps> = ({ email, password, setEmail, setPassword }) => {
  return (
    <>
      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        style={{ backgroundColor: "#2F2D2D" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordBox
        placeholder="Password"
        value={password}
        onChange={setPassword}
      />
    </>
  );
};

export default NormalLogin;
