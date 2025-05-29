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

function List() {
  const [mediaList, setMediaList] = useState([]);
  const [editId, setEditId] = useState('');
  const [editScore, setScoreId] = useState('');

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
      body: JSON.stringify({ score: Number(editScore) }),
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

  return (
    <div>
      <h1>Show List</h1>
      {mediaList.map((media) => (
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
            </form>
          ) : (
            <p>
              {media.title} - Genre: {media.genre} - Score: {media.score}
            </p>
          )}
          <button onClick={() => {
            setEditId(media.id);
            setScoreId(media.score.toString());
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
      </Routes>
    </Router>
  );
}

export default App;
