import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const query = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
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
`;




const DetailPage = () => {
  const { id } = useParams()
  const [valueData, setValueData] = useState(null);
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
          <h1>{valueData.title.romaji}</h1>
          <p>Episodes: {valueData.episodes}</p>
          <p>Format: {valueData.format}</p>
          <img src={valueData.coverImage.large} alt={valueData.title.romaji} />
        </div>
      )}
    </div>
  );
}
export default DetailPage; 