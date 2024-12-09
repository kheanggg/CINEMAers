import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Movie from "./movie/page"
export default function app() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/movie" element={<Movie/>}></Route>
            </Routes>
        </BrowserRouter> 
    </>
  )
}
