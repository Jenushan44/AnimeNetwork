import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { useState } from 'react'
import logo from './assets/anime-network-logo.png';
import { auth } from "./firebase";


function NavBar({ user, handleLogout, setPopupMessage }) {
  const [anime, setAnime] = useState(""); // Holds text typed into search bar 
  const navigate = useNavigate(); //Redirects user to different route 

  const handleProfileClick = () => {
    if (!auth.currentUser) {
      setPopupMessage("Please login or signup to view your profile");

      setTimeout(() => { // Pop up message clears after 5 seconds
        setPopupMessage("");
      }, 5000);

      navigate("/")
    } else {
      navigate("profile");
    }
  }

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
          <div className="user-control">
            <div className="user-greeting">
              <span>Hello, {user.displayName || user.email}</span>
            </div>

            <button className="logout-btn" onClick={() => {
              handleLogout();
              navigate("/");
            }}>
              Logout
            </button>
          </div>
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
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/list">MyList</Link>
          <button className="nav-link" onClick={handleProfileClick}>
            Profile
          </button>
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
