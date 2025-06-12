import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { auth } from "../firebase";
import { Doughnut } from "react-chartjs-2";

function ProfilePage() {

  const user = auth.currentUser;
  const [stats, setStats] = useState(null);
  const location = useLocation(); // gives information about current URL/page

  useEffect(() => { // When profile page shows up run this (useEffect)
    async function fetchData() {
      const user = auth.currentUser;
      if (!user) return; // Checks if a user is logged in

      const token = await user.getIdToken();

      const result = await fetch("http://localhost:5000/profile", { // Sends a GET request to Flask backend at /profile and retrieves all data 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // attaches firebase ID token using Bearer token format
        }
      });

      const data = await result.json();
      setStats(data);
    }
    fetchData();
  }, [location]); // Refreshes profile page data every time user goes to it

  if (!stats) { // Waits until the stats is loaded
    return <p className="profile-loading">Loading stats...</p>;
  }

  const statusCounts = stats.status_counts || {};
  const chartData = {
    labels: ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"],
    datasets: [{
      data: [
        statusCounts["Watching"] || 0,
        statusCounts["Completed"] || 0,
        statusCounts["On Hold"] || 0,
        statusCounts["Dropped"] || 0,
        statusCounts["Plan to Watch"] || 0,
      ],
      backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'],
      borderWidth: 1,
    }]
  };



  return (
    <div className="profile-container">
      <h1 className="profile-title">Anime Stats</h1>
      {user && (
        <h2 className="profile-username">Welcome, {user.displayName || user.email}</h2>
      )}

      <div className="profile-grid">
        <div className="profile-stat"><strong>Days:</strong> {stats.total_days}</div>
        <div className="profile-stat"><strong>Mean Score:</strong> {stats.mean_score}</div>
        <div className="profile-stat"><strong>Total Entries:</strong> {stats.total_entries}</div>
        <div className="profile-stat"><strong>Episodes:</strong> {stats.episodes_watched}</div>
      </div>

      <div className="chart-wrapper">
        <h3>Status Breakdown</h3>
        <div style={{ width: "300px", height: "300px" }}>
          <Doughnut data={chartData} />
        </div>
      </div>


      <div className="recent-section">
        <h3>Your Latest Picks</h3>
        <div className="recent-grid">
          {stats.recent_entries?.map((anime, index) => (
            <Link to={`/details/${anime.id}`} key={index} className="recent-card">
              <img src={anime.coverImage} alt={anime.title} />
              <p>{anime.title.length > 20 ? anime.title.slice(0, 17) + '...' : anime.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;