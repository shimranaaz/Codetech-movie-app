import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MovieSearchApp from "./MovieSearchApp";
import Favorites from "./Favorites";
import { FaHeart } from "react-icons/fa"; 
import "./App.css";

const App = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteCount(savedFavorites.length);
  }, []);

  const updateFavoriteCount = () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteCount(savedFavorites.length);
  };

  return (
    <Router>
      <div className="app-container">
        <Link to="/favorites" className="heart-icon">
          <FaHeart size={30} color="red" />
          <span className="favorite-count">{favoriteCount}</span>
        </Link>

        <Routes>
          <Route path="/" element={<MovieSearchApp updateFavoriteCount={updateFavoriteCount} />} />
          <Route path="/favorites" element={<Favorites updateFavoriteCount={updateFavoriteCount} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
