import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  const qlQuery = `
    query ($search: String) {
      Page(perPage: 5) {
        media(search: $search, type: ANIME) {
          id
          title {
            english
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

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
      <h2>You searched for: {query}</h2>
      <ul>
        {results.map((anime) => (
          <li key={anime.id}>
            <Link to={`/details/${anime.id}`}>
              <img
                src={anime.coverImage.large}
                alt={anime.title.english}
                width="100"
              />
              <p>
                {anime.title.english} — {anime.episodes} episodes
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
