import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SearchResults from "./SearchResults";


const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
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
`;

const DetailPage = () => {
  const { id } = useParams()
  const [valueData, setValueData] = useState(null);
  const handleAddShelf = async () => {

    if (!valueData) return;

    const res = await fetch("http://localhost:5000/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: valueData.title.english,
        anilist_id: valueData.id,
        genre: "N/A",
        score: 0, // Set by the user and not the api so initially 0
        status: "Watching",
        episodes: valueData.episodes || 0,
        coverImage: valueData.coverImage.large
      })
    });
  }

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            query: query,
            variables: { id: Number(id) }
          })
        });

        const result = await response.json();
        setValueData(result.data.Media);
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      }
    };

    fetchAnime();
  }, [id]);

  return (
    <div>
      {valueData === null ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{valueData.title.english}</h1>
          <p>Episodes: {valueData.episodes}</p>
          <p>Format: {valueData.format}</p>
          <img src={valueData.coverImage.large} alt={valueData.title.english} />
          <Link to='/'>Home Page</Link>
        </div>
      )}
      <button onClick={handleAddShelf}>Add to Shelf</button>
    </div>
  );
}
export default DetailPage; 