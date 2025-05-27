import React, { useState } from "react";
import { Link } from "react-router-dom";

function SearchBar() {
  const [anime, setAnime] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [sAnime, setAnime2] = useState([]);

  const query = `
    query ($search: String) {
      Page(perPage: 5) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
          }
          episodes
          format
          coverImage {
            large
          }
        }
      }
    }
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      search: anime
    };

    try {
      const result = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      });

      const json = await result.json();
      setAnime2(json.data.Page.media);
      setSubmitted(anime);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
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

      <button
        type="button"
        onClick={() => {
          setAnime("");
          setSubmitted("");
          setAnime2([]);
        }}
      >
        Clear
      </button>

      {submitted && <p>You searched for: {submitted}</p>}

      <ul>
        {sAnime.map((anime) => (
          <li key={anime.id}>
            <Link to={`/details/${anime.id}`}>
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                width="100"
              />
              <p>
                {anime.title.romaji} — {anime.episodes} episodes
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SearchBar;
