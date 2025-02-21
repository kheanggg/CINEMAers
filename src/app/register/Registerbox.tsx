"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  username: string;
  dob: string;
  email: string;
  phone_number: string;
  password: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  dob?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

interface ApiError {
  field: string;
  message: string;
}

export default function RegisterBox() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    dob: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.username) errors.username = "Username is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone_number) errors.phone_number = "Phone Number is required";
    if (!formData.password) errors.password = "Password is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSuccessMessage("");
      return;
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
        setError("");
        setFormErrors({});
        setFormData({
          name: "",
          username: "",
          dob: "",
          email: "",
          phone_number: "",
          password: "",
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        if (result.errors) {
          const apiErrors = (result.errors as ApiError[]).reduce<FormErrors>(
            (acc, err) => {
              acc[err.field as keyof FormErrors] = err.message;
              return acc;
            },
            {}
          );
          setFormErrors(apiErrors);
        } else {
          setError(result.error || "Registration failed. Please try again.");
        }
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again later.");
      setSuccessMessage("");
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
          Let&apos;s get you READY!
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