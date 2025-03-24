import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "6d25a6e0";
const SEARCH_API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;
const DETAILS_API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&i=`;

const MovieSearchApp = ({ updateFavoriteCount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const NOT_FOUND_IMAGE = "https://www.prokerala.com/movies/assets/img/no-poster-available.jpg";

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const searchMovies = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(SEARCH_API_URL + searchTerm);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError("No movies found!");
      }
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(DETAILS_API_URL + movieId);
      const data = await response.json();
      if (data.Response === "True") {
        const trailerLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(
          data.Title + " official trailer"
        )}`;
        setSelectedMovie({ ...data, trailerLink });
      }
    } catch {
      setError("Failed to fetch movie details");
    }
  };

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      updateFavoriteCount();
    }
  };

  const removeFromFavorites = (movie) => {
    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    updateFavoriteCount();
  };

  return (
    <div className="container">
      <h1>Movie Search App 🎬</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {loading && <p className="loading">Loading movies...</p>}

      {error && (
        <div className="error">
          <p>{error}</p>
          <img src={NOT_FOUND_IMAGE} alt="Not Found" className="not-found-image" />
        </div>
      )}

      <div className="movies">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie">
            <img src={movie.Poster !== "N/A" ? movie.Poster : NOT_FOUND_IMAGE} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <div className="movie-buttons">
              <button onClick={() => fetchMovieDetails(movie.imdbID)}>📄 View Details</button>
              <button onClick={() => addToFavorites(movie)}>⭐ Add to Favorites</button>
            </div>
          </div>
        ))}
      </div>

      {/* Favorite Movies */}
      {favorites.length > 0 && (
        <>
          <h2>Favorite Movies ❤️</h2>
          <div className="movies">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="movie">
                <img src={movie.Poster !== "N/A" ? movie.Poster : NOT_FOUND_IMAGE} alt={movie.Title} />
                <h3>{movie.Title}</h3>
                <button onClick={() => removeFromFavorites(movie)}>❌ Remove</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="movie-details-overlay">
          <div className="movie-details">
            <button className="close-button" onClick={() => setSelectedMovie(null)}>❌</button>
            <h2>{selectedMovie.Title}</h2>
            <img src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : NOT_FOUND_IMAGE} alt={selectedMovie.Title} />
            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <a href={selectedMovie.trailerLink} target="_blank" rel="noopener noreferrer" className="trailer-button">
            🎬 Watch Trailer
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearchApp;
