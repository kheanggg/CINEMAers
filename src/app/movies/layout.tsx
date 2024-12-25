import React from "react";
import Header from "../components/layout/Header"

const Movie: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Header/>
            <main>
                {children}
            </main>
        </>
    );
};

export default Movie;