import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './SearchBar.js'
import DetailPage from './DetailPage.js'
import { useState, useEffect } from 'react'

function Home() {
  return (
    <div className="App">
      <h1>Welcome to Animeshelf</h1>
      <SearchBar /> { }
      <Link to='/list'>My List</Link>
    </div>
  );
}

function List() {
  const [mediaList, setMediaList] = useState([])
  const handleDelete = (idDelete) => {
    const updateList = mediaList.filter((media) => media.id != idDelete)
    setMediaList(updateList)
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/list");
      const data = await response.json();
      console.log("ACTUAL data returned from /list:", data);
      setMediaList(data);
    }
    fetchData();
  }, []);



  return (
    <div>
      <h1>Show List</h1>
      {mediaList.map((media) => (
        <div key={media.id}>
          {media.title} - Genre: {media.genre} - Score: {media.score}
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
