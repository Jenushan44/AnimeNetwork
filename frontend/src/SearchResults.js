import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DetailPage from './DetailPage.js';
import { handleAddShelf } from "./utils/api";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  const qlQuery = `
    query ($search: String) {
      Page(perPage: 25) {
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
    <div className="search-list">
      {results.map((anime) => {
        const scoreRank = anime.rankings?.find(
          (r) => r.type === "RATED" && r.allTime
        );

        return (
          <div key={anime.id} className="anime-entry">
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
        );
      })}
    </div>
  );
}

export default SearchResults;
