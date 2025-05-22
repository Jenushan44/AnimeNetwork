import React, { useState } from "react";

function SearchBar() {
  const [anime, setAnime] = useState("");
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(anime);
    console.log("Submitted:", anime);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Search for anime</h2>
      <input
        placeholder="Search"
        value={anime}
        onChange={(e) => setAnime(e.target.value)}
      />

      <button type="submit">Submit</button>
      <button type="button" onClick={() => setAnime("")}>
        Clear
      </button>

      {submitted && <p>You searched for: {submitted}</p>}
    </form>
  );
}

export default SearchBar;
