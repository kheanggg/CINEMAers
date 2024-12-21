"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterBox() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    dob: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});

  const registerContainerStyle = {
    opacity: 0.8,
    backgroundColor: "#1D1B1B",
    borderRadius: "15px",
  };

  const errorTextStyle = {
    minHeight: "25px",
    display: "block",
    padding: "0px",
    fontSize: "15px",
    color: "red",
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.username) errors.username = "Username is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone_number)
      errors.phone_number = "Phone Number is required";
    if (!formData.password) errors.password = "Password is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // If no errors, return true
  };
  
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      setSuccessMessage(""); // Clear any previous success message
      return; // Stop if validation fails
    }

    

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(
          result.message || "Registration successful! Redirecting..."
        );
        setError(""); // Clear any previous error messages
        setFormErrors({}); // Clear validation errors
        setFormData({
          name: "",
          username: "",
          dob: "",
          email: "",
          phone_number: "",
          password: "",
        }); // Clear form fields

        // Add redirection
        setTimeout(() => {
          router.push("/login"); // Redirect to the login page after 2 seconds
        }, 2000);
      } else {
        // Handle server errors
        if (result.errors) {
          const apiErrors = result.errors.reduce((acc: any, err: any) => {
            acc[err.field] = err.message;
            return acc;
          }, {});
          setFormErrors(apiErrors);
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
        setSuccessMessage(""); // Clear success message
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again later.");
      setSuccessMessage(""); // Clear success message
    }
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
      <div className="w-full max-w-lg p-8 mx-4" style={registerContainerStyle}>
        <h1 className="text-2xl font-bold mb-3 text-white">
          Let's get you READY!
        </h1>
        <p className="text-gray-300">
          Fill in the information below to get started.
        </p>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Name */}
        <div className="mb-3">
          <p className="text-white">Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
          {formErrors.name && (
            <span style={errorTextStyle}>{formErrors.name}</span>
          )}
        </div>

        {/* Username and Date of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-white">Username</p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
            {formErrors.username && (
              <span style={errorTextStyle}>{formErrors.username}</span>
            )}
          </div>
          <div>
            <p className="text-white">Date of Birth</p>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-800 text-white"
            />
            {formErrors.dob && (
              <span style={errorTextStyle}>{formErrors.dob}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <p className="text-white">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
          {formErrors.email && (
            <span style={errorTextStyle}>{formErrors.email}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <p className="text-white">Phone Number</p>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
          {formErrors.phone_number && (
            <span style={errorTextStyle}>{formErrors.phone_number}</span>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <p className="text-white">Password</p>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
          {formErrors.password && (
            <span style={errorTextStyle}>{formErrors.password}</span>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="text-white bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
