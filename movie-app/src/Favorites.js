import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NOT_FOUND_IMAGE = "https://movie-app-shimra.netlify.app/movie_not_found.png";

const Favorites = ({ updateFavoriteCount }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFromFavorites = (movie) => {
    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    updateFavoriteCount();
  };

  return (
    <div className="container">
      <h1>Favorite Movies ❤️</h1>
      <Link to="/" className="back-button">🔙 Back to Search</Link>

      <div className="movies">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div key={movie.imdbID} className="movie">
              <img src={movie.Poster !== "N/A" ? movie.Poster : NOT_FOUND_IMAGE} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <button onClick={() => removeFromFavorites(movie)}>❌ Remove</button>
            </div>
          ))
        ) : (
          <p>No favorite movies added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
