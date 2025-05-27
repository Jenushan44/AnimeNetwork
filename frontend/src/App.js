import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './SearchBar.js'
import DetailPage from './DetailPage.js'

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
  return (
    <div>
      <h1>Show List</h1>
      { }
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
