"use client"

import React from "react";
import Header from "../components/layout/Header"
import { SessionProvider } from "next-auth/react";

const Movie: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SessionProvider>
            <Header/>
            <main>
                {children}
            </main>
        </SessionProvider>
    );
};

export default Movie;