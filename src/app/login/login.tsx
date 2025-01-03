'use client';

import React from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
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
            <div className="flex flex-row md:rounded-[15px]">
                <div className="relative w-[241px] h-[600px] overflow-hidden hidden md:block">
                    <Image
                        src="/login_assets/login_image_container.jpg"
                        alt="water tower image"
                        width={241}
                        height={600}
                    />
                </div>

                <div className="w-[603px] h-[600px] p-8" style={{ backgroundColor: "#1D1B1B", opacity: 0.8 }}>
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">
                        Welcome, CINEMAers!
                    </h2>
                    <p className="mb-6">
                        Let's grab some popcorn, shall we? Don't have an account?
                        <a href="/register" className="text-red-500 hover:underline">
                            {" "}register one
                        </a>
                    </p>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
