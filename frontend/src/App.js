import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function Home() {
  return (
    <div className="App">
      <h1>Welcome to Animeshelf</h1>
      <Link to='/list'>My List</Link>
    </div>
  );
}

function List() {
  return (
    <div>
      <h1>Show List</h1>
      {/* fetch data */}
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
      </Routes>
    </Router>



  );
}

export default App;
