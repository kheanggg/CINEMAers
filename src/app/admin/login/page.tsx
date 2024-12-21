'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AdminLoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const router = useRouter();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true); // Set loading state to true when submitting
        setError(""); // Clear previous errors

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push("/admin/dashboard"); // Redirect to the dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
            <div className="w-full md:w-[550px] p-8 md:p-12 bg-black bg-opacity-80 rounded-[15px]">

                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    Admin Login
                </h2>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: "#F3F4F6", color: "black" }} // Black text for input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: "#F3F4F6", color: "black" }} // Black text for input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            aria-label="Toggle password visibility"
                            type="button"
                        >
                            {passwordVisible ? (
                                <img src="/login_assets/view.svg" alt="View password" width={20} height={20} />
                            ) : (
                                <img src="/login_assets/hidden.svg" alt="Hide password" width={20} height={20} />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="w-full p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                            disabled={loading} // Disable the button while loading
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminLoginForm;
