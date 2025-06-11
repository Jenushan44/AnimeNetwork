import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DetailPage from './DetailPage.js';
import { handleAddShelf } from "./utils/api";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("All"); // stores which format user wants to see

  const qlQuery = `
    query ($search: String) {
      Page(perPage: 100) {
        media(search: $search, type: ANIME) {
          id
          title {
            english
            romaji
            native
          }
          episodes
          format
          coverImage {
            large
          }
          averageScore
          rankings {
            rank
            type
            allTime
          }
        }
      }
    }
  `;

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: qlQuery,
          variables: { search: query },
        }),
      });

      const json = await response.json();
      setResults(json.data.Page.media);
    };


    fetchData();
  }, [query]);


  return (
    <div>
      <h1 className="search-res">Search Results for: {query}</h1>
      <div className="search-filter">
        <button className="search-all" onClick={() => setFilter("All")}>All</button>
        <button className="search-tv" onClick={() => setFilter("TV")}>TV</button>
        <button className="search-movie" onClick={() => setFilter("MOVIE")}>Movie</button>
        <button className="search-ona" onClick={() => setFilter("ONA")}>ONA</button>
        <button className="search-special" onClick={() => setFilter("SPECIAL")}>Special</button>
      </div>


      <div className="search-list">
        {results

          .filter(anime => filter === "All" || anime.format === filter)
          .map((anime) => {
            const scoreRank = anime.rankings?.find(
              (r) => r.type === "RATED" && r.allTime
            );

            return (
              <Link to={`/details/${anime.id}`} key={anime.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="anime-entry">
                  <img
                    className="search-image"
                    src={anime.coverImage.large}
                    alt={anime.title.english}
                  />
                  <div className="search-info">
                    <h3 className="search-title">
                      {anime.title?.english || anime.title?.romaji || anime.title?.native || "Title not found"}
                    </h3>

                    <div className="search-info-row">
                      <p className="search-format"><strong>{anime.format}</strong></p>
                      <p className="search-episode">({anime.episodes} episodes)</p>
                    </div>

                    <div className="search-score-rank">
                      <p className="search-scored">
                        Scored: {(anime.averageScore / 10).toFixed(2) || "N/A"}
                      </p>
                      <p className="search-rank">Rank: {scoreRank ? `#${scoreRank.rank}` : "Not Ranked"}</p>
                    </div>

                    <button onClick={() => handleAddShelf(anime)} className="add-list-btn">Add to list</button>

                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default SearchResults;
