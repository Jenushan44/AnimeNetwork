import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { handleAddShelf } from "../utils/api";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import { auth } from "../firebase";

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
      format
      trailer {
        id 
        site 
        thumbnail  
      }
      description
      duration 
      season
      seasonYear
      startDate {
        year
        month 
        day
      }
      endDate {
        year
        month
        day
      }
      genres
      characters(perPage: 20) {
        edges {
          role
        node {
          id
        name {
          full
        }
        image {
          large
          medium
        }
      }
    }
  }

    }
  }
`;

const DetailPage = ({ editStatus, setStatus, setPopupMsg }) => {
  const { id } = useParams()
  const [valueData, setValueData] = useState(null);
  const navigate = useNavigate() // Used to redirect to another page
  const location = useLocation();
  const scrollReference = useRef(null);
  const { gridRef, scrollLeft, scrollRight } = useHorizontalScroll();



  useEffect(() => {

    const controller = new AbortController();

    const fetchAnime = async () => {
      try {
        const response = await fetch(`http://localhost:5000/anilist/details/${id}`, {
          signal: controller.signal
        });

        const result = await response.json();

        if (result?.data?.Media) {
          setValueData(result.data.Media);
        } else {
          console.error("AniList data missing:", result);
        }


        if (result?.data?.Media) {
          setValueData(result.data.Media);
        } else {
          console.error("AniList API error:", result);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch anime:", error);
        }
      }
    };


    fetchAnime();

    return () => {
      controller.abort();
    };

  }, [id]);

  return (
    <div>
      {valueData === null ? (
        <p>Loading...</p>
      ) : (
        <div className="anime-detail-layout">
          <div className="image-description">
            <div className="image-column">
              <img src={valueData.coverImage.large} alt={valueData.title.english} />
              <button
                className="detail-add-button"
                onClick={async () => {
                  const user = auth.currentUser;
                  await handleAddShelf(valueData, setPopupMsg, navigate);
                }}
              >Add to shelf</button>

            </div>

            <div className="description-info">
              <h1 className="description-title">{valueData.title.english}</h1>

              <p className="detail-descrip">{valueData.description.replace(/<[^>]+>/g, '').split("<i>Notes:")[0]}</p>
              <h2 className="anime-section-heading">Anime Details</h2>

              <div className="detail-info">
                <div className="left-info">
                  <p><strong>Format: </strong>{valueData.format}</p>
                  <p><strong>Episodes: </strong> {valueData.episodes} eps</p>
                  <p><strong>Duration: </strong> {valueData.duration} mins</p>
                  <p><strong>Genres: </strong> {valueData.genres?.slice(0, 3).join(", ")}</p>
                </div>
                <div className="right-info">
                  <p><strong>Season: </strong> {valueData.season.charAt(0) + valueData.season.slice(1).toLowerCase()} {valueData.seasonYear}</p>
                  <p>
                    <strong>Start Date: </strong> {" "}
                    {valueData.startDate?.year // checks if start date exists and has a year field
                      ? `${[
                        "", // index 0 not used 
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                      ][valueData.startDate.month]} ${valueData.startDate.day}, ${valueData.startDate.year}`
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>End Date: </strong>{" "}
                    {valueData.endDate?.year
                      ? `${[
                        "",
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                      ][valueData.endDate.month]} ${valueData.endDate.day}, ${valueData.endDate.year}`
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
            <div className="character-wrapper">
              <h1 className="character-title">Characters</h1>
              <div className="character-scroll-container">
                <button className="character-scroll-left" onClick={scrollLeft}>{'<'}</button>
                <div className="character-scroll" ref={gridRef}>
                  {valueData.characters?.edges?.map((char) => (
                    <div className="character-card" key={char.node.id}>
                      <img src={char.node.image.medium} alt={char.node.name.full} />
                      <p>{char.node.name.full}</p>
                      <p>({char.role})</p>
                    </div>
                  ))}
                </div>
                <button className="character-scroll-right" onClick={scrollRight}>{'>'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPage; 