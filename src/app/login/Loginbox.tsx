"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  // State variables for handling email, password, and password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // API integration logic goes here
    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirection
      email,
      password,
    });

    if (result?.error) {
      setError(result.error); // Handle login error
    } else {
      setError(""); // Clear error if successful
      // alert("Logged in successfully!");
      // Optionally, navigate to a protected route
      router.push("/homepage");
    }
  };

  // Function to handle google login
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/homepage" });
  };

  // Styling for login container background and other elements
  const loginContainer = {
    opacity: 0.8,
    backgroundColor: "#1D1B1B",
  };

  const loginImage = {
    // Additional styling for the image container, if needed
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/login_assets/login_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {/* Main container for the login form */}
      <div className="flex flex-row md:rounded-[15px]">
        {/* Left-side image container (visible only on medium screens and above) */}
        <div
          className="relative w-[241px] h-[600px] overflow-hidden hidden md:block"
          style={loginImage}
        >
          <Image
            src="/login_assets/login_image_container.jpg"
            alt="water tower image"
            width={241}
            height={600}
          />
        </div>

        {/* Right-side login form container */}
        <div className="w-[603px] h-[600px] p-8" style={loginContainer}>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Welcome, CINEMAers!
          </h2>
          <p>
            Let's grab some popcorn, shall we? Don't have an account?
            <Link href="/register" className="text-red-500 hover:underline">
              {" "}
              register one
            </Link>
          </p>

          {/* Login form */}
          <form onSubmit={handleLoginSubmit} className="mt-10">
            {/* Email input field */}
            <input
              type="email"
              placeholder="Email / Phone Number"
              className="w-full p-2 mb-4 border rounded"
              style={{ backgroundColor: "#2F2D2D" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input field with toggle visibility button */}
            <div className="relative mb-5">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 border rounded"
                style={{ backgroundColor: "#2F2D2D" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Toggle password visibility"
                type="button"
              >
                {passwordVisible ? (
                  <img
                    src="/login_assets/view.svg"
                    alt="View password"
                    width={20}
                    height={20}
                  />
                ) : (
                  <img
                    src="/login_assets/hidden.svg"
                    alt="Hide password"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-between">
              <div></div>
              <Link
                href="/login/forget"
                className="hover:underline"
                style={{ color: "#E79C11" }}
              >
                forgot password?
              </Link>
            </div>

            {/* Login button */}
            <div className="flex justify-center mt-3 mb-5">
              <button
                type="submit"
                className="p-2 bg-red-600 text-white rounded"
                style={{ height: "42px", width: "119px", borderRadius: "45px" }}
              >
                LOGIN
              </button>
            </div>

            {/* Divider for alternative login methods */}
            <div className="flex items-center justify-center">
              <hr className="flex-grow border-t border-gray-500 w-20" />
              <span className="mx-4 text-white">or login with</span>
              <hr className="flex-grow border-t border-gray-500 w-20" />
            </div>

            {/* Social login buttons */}
            <div className="mt-10">
              {/* Google login button */}
              <button
                className="w-full flex items-center relative justify-center rounded hover:underline"
                style={{
                  backgroundColor: "#2F2D2D",
                  padding: "10px",
                  borderRadius: "20px",
                }}
                onClick={handleGoogleLogin}
              >
                <div className="absolute left-5">
                  <Image
                    src="/login_assets/google_icon.svg"
                    alt="Google icon"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="flex-grow text-center">
                  Continue with Google
                </span>
              </button>

              {/* Facebook login button */}
              <button
                className="w-full mt-5 flex items-center relative justify-center rounded hover:underline"
                style={{
                  backgroundColor: "#2F2D2D",
                  padding: "10px",
                  borderRadius: "20px",
                }}
              >
                <div className="absolute left-5">
                  <Image
                    src="/login_assets/facebook_icon.svg"
                    alt="Facebook icon"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="flex-grow text-center">
                  Continue with Facebook
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
