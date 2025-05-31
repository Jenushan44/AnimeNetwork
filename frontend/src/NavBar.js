import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { useState } from 'react'
import SearchResults from "./SearchResults";


function NavBar() {
  const [anime, setAnime] = useState(""); // Holds text typed into search bar 
  const navigate = useNavigate(); //Redirects user to different route 

  const submitHandle = (event) => {
    event.preventDefault();
    if (!anime.trim()) return;
    navigate(`/results?query=${encodeURIComponent(anime)}`); // Redirect to result page
    setAnime(""); // Clear search bar
  };

  return (
    <nav className="navbar">
      <div className="nav-left">

        <Link to="/">Home</Link>
        <Link to="/list">MyList</Link>
        <Link to="/profile">Profile</Link>

      </div>

      <form onSubmit={submitHandle} className="nav-search">
        <input
          type="text"
          placeholder="Search"
          value={anime}
          onChange={(e) => setAnime(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}

export default NavBar;
