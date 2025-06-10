import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { useState } from 'react'
import logo from './assets/anime-network-logo.png';


function NavBar({ user, handleLogout }) {
  const [anime, setAnime] = useState(""); // Holds text typed into search bar 
  const navigate = useNavigate(); //Redirects user to different route 

  const submitHandle = (event) => {
    event.preventDefault();
    if (!anime.trim()) return;
    navigate(`/results?query=${encodeURIComponent(anime)}`); // Redirect to result page
    setAnime(""); // Clear search bar
  };

  const handleRegisterClick = () => {
    navigate("/register");
  }

  return (
    <div className="navbar-wrapper">
      <div className="logo-bar">
        <img src={logo} className="logo-img" />
        {user ? (
          <><span>Hello, {user.displayName || user.email}</span> <button className="logout-btn" onClick={handleLogout}>Logout</button></>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="signup-btn" onClick={() => navigate("/register")}>Sign up</button>


            {/*Displays information on navbar based on whether or not user is logged in*/}
          </>
        )}


      </div>
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
    </div>
  );
}

export default NavBar;
