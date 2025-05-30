import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './SearchBar.js';
import DetailPage from './DetailPage.js';
import { useState, useEffect } from 'react';

function Home() {
  return (
    <div className="App">
      <h1>Welcome to Animeshelf</h1>
      <SearchBar />
      <Link to='/list'>My List</Link>
    </div>
  );
}

function ProfilePage() {

  const [totalTime, setTotalTime] = useState(0)
  const [totalEpisodes, setTotalEpisode] = useState(0)

  useEffect(() => { // When profile page shows up run this (useEffect)
    async function fetchData() {
      const result = await fetch("http://localhost:5000/profile")  // Sends a GET request to Flask backend at /profile and retrieves all data 
      const data = await result.json()
      setTotalTime(data.total)
      setTotalEpisode(data.episodes)
    }
    fetchData();

  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Days Watched: {totalTime} days</p>
      <p>Episodes Watched: {totalEpisodes} episodes</p>
    </div>
  );
}

function List() {
  const [mediaList, setMediaList] = useState([]);
  const [editId, setEditId] = useState('');
  const [editScore, setScoreId] = useState('');
  const [editStatus, setStatus] = useState('');
  const [filterStatus, editFilterStatus] = useState("All")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/list");
      const data = await response.json();
      setMediaList(data);
    };
    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    await fetch(`http://localhost:5000/list/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: Number(editScore), status: editStatus }),
    });
    setEditId("");
    setScoreId("");

    const response = await fetch("http://localhost:5000/list");
    const data = await response.json();
    setMediaList(data);
  };


  // Function deletes anime from the list by sending a DELETE rquest using fetch() to the backend 
  // including the anime's ID meaning headers/body needed since no additional data is required 
  // After the request is successful, it updates the local list by removing the deleted anime 
  const handleDelete = async (idDelete) => {
    await fetch(`http://localhost:5000/list/${idDelete}`, {
      method: "DELETE"
    });

    const updateList = mediaList.filter((media) => media.id != idDelete);
    setMediaList(updateList);
  };

  const filteredList = filterStatus === "All"
    ? mediaList // if true condition to check if filterStatus is All
    : mediaList.filter((media) => media.status === filterStatus); // else condition to filter for other states



  return (
    <div>

      <h1>Show List</h1>
      <form>
        <select value={filterStatus} onChange={(e) => editFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Watching">Watching</option>
          <option value="On Hold">On Hold</option>
          <option value="Plan to watch">Plan to watch</option>
          <option value="Dropped">Dropped</option>
        </select>

        <select>
          <option value="Title">Title</option>
          <option value="Score">Score</option>
        </select>

      </form>

      {filteredList.map((media) => (
        <div key={media.id}>
          {editId == media.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(media.id);
              }}
            >
              <select value={editScore} onChange={(e) => setScoreId(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              <button type="submit">Save</button>
              <button type="button" onClick={() => {
                setEditId("");
                setScoreId("");
              }}>Cancel</button>

              <select value={editStatus} onChange={(e) => setStatus(e.target.value)}>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Plan to watch">Plan to watch</option>
                <option value="On Hold">On Hold</option>
                <option value="Dropped">Dropped</option>
              </select>

            </form>

          ) : (
            <p>
              {media.title} - Genre: {media.genre} - Score: {media.score} - Status: {media.status}
            </p>
          )}
          <button onClick={() => {
            setEditId(media.id);
            setScoreId(media.score.toString());
            setStatus(media.status);
          }}>Edit</button>
          <button onClick={() => handleDelete(media.id)}>Delete</button>

        </div>
      ))}
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
