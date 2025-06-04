import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DetailPage from './DetailPage.js';
import { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import SearchResults from "./SearchResults";


function getCurrentSeason() {
  const date = new Date(); // Contains current Date object that contains current data and time
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const season =
    month >= 1 && month <= 3 ? "WINTER" :
      month >= 4 && month <= 6 ? "SPRING" :
        month >= 7 && month <= 9 ? "SUMMER" :
          "FALL";

  return { season, year };
}

function Home() {

  //const [seasonal, setSeasonal] = useState([]);
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]); // Initialize state where list of trending anime is stored
  const [animeList, setAnimeList] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const featured = trending[bannerIndex]; // the most trending anime
  const [category, setCategory] = useState("airing");

  function Next() {
    if (bannerIndex === trending.length - 1) {
      setBannerIndex((bannerIndex) => 0)
    } else {
      setBannerIndex((bannerIndex) => bannerIndex + 1)
    }

  }

  function Prev() {
    if (bannerIndex === 0) {
      setBannerIndex((bannerIndex) => trending.length - 1);
    } else {
      setBannerIndex((bannerIndex) => bannerIndex - 1)
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/anilist/trending")
      .then(res => res.json())
      .then(data => {
        if (data?.data?.Page?.media) {
          setTrending(data.data.Page.media);
        } else {
          console.error("AniList API error:", data);
        }
      })
      .catch(err => console.error("Network Error:", err));
  }, []);


  useEffect(() => {
    let url = "";

    if (category === "airing") {
      url = "http://localhost:5000/anilist/airing";
    } else {
      url = `http://localhost:5000/anilist/season?season=${category}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.Page?.media) {
          setAnimeList(data.data.Page.media);
        } else {
          console.error("AniList API error:", data);
        }
      })
      .catch((err) => console.error("Network Error:", err));
  }, [category]);


  return (
    <div className="App home-container">
      {featured && (
        <section
          className="hero-banner"
          style={{
            backgroundImage: `url(${featured.bannerImage || featured.coverImage.extraLarge})`,
          }}
        >
          <div className="overlay-banner"></div>
          <div className="hero-overlay">
            <h1 className="genre-banner">{featured.genres?.join(", ")}</h1>
            <h2>{featured.title.romaji}</h2>
            <p>{featured.description?.replace(/<[^>]+>/g, "").slice(0, 200)}...</p>
            <Link to={`/details/${featured.id}`} className="read-more-btn">
              Read more
            </Link>
          </div>
          <div className="banner-btn">
            <button onClick={Next}>{'<'}</button>
            <button onClick={Prev}>{'>'}</button>
          </div>
        </section>
      )}

      <section className="season-section">
        <div className="season-headings">
          <button onClick={() => setCategory("airing")} className="airing-title"> Airing </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("spring")} className="spring-title"> Spring </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("summer")} className="summer-title"> Summer </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("winter")} className="winter-title"> Winter </button>
        </div>
        <div className='airing-grid'>
          {animeList.map((anime) => (
            <div className="airing-card" key={anime.id}>
              <Link to={`/details/${anime.id}`}>
                <img src={anime.coverImage.large} alt={anime.title.english} />
                <p className="anime-genre">{anime.genres?.slice(0, 3).join(", ")}</p>
                <p className="anime-title">
                  {anime.title.english?.length > 22
                    ? anime.title.english.slice(0, 22) + "..."
                    : anime.title.english}
                </p>
              </Link>
            </div>
          ))}
        </div>


      </section >


    </div >
  )
};

function ProfilePage() {

  const [totalTime, setTotalTime] = useState(0)
  const [totalEpisodes, setTotalEpisode] = useState(0)

  useEffect(() => { // When profile page shows up run this (useEffect)
    async function fetchData() {
      const result = await fetch("http://localhost:5000/profile")  // Sends a GET request to Flask backend at /profile and retrieves all data 
      const data = await result.json()
      setTotalTime(data.total)
      setTotalEpisode(data.episodes)
    }
    fetchData();

  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Days Watched: {totalTime} days</p>
      <p>Episodes Watched: {totalEpisodes} episodes</p>
    </div>
  );
}

function List() {
  const [mediaList, setMediaList] = useState([]);
  const [editId, setEditId] = useState('');
  const [editScore, setScoreId] = useState('');
  const [editStatus, setStatus] = useState('');
  const [filterStatus, editFilterStatus] = useState("All")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/list");
      const data = await response.json();
      setMediaList(data);
    };
    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    await fetch(`http://localhost:5000/list/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: Number(editScore), status: editStatus }),
    });
    setEditId("");
    setScoreId("");

    const response = await fetch("http://localhost:5000/list");
    const data = await response.json();
    setMediaList(data);
  };


  // Function deletes anime from the list by sending a DELETE rquest using fetch() to the backend 
  // including the anime's ID meaning headers/body needed since no additional data is required 
  // After the request is successful, it updates the local list by removing the deleted anime 
  const handleDelete = async (idDelete) => {
    await fetch(`http://localhost:5000/list/${idDelete}`, {
      method: "DELETE"
    });

    const updateList = mediaList.filter((media) => media.id != idDelete);
    setMediaList(updateList);
  };

  const filteredList = filterStatus === "All"
    ? mediaList // if true condition to check if filterStatus is All
    : mediaList.filter((media) => media.status === filterStatus); // else condition to filter for other states



  return (
    <div>

      <h1>Show List</h1>
      <form>
        <select value={filterStatus} onChange={(e) => editFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Watching">Watching</option>
          <option value="On Hold">On Hold</option>
          <option value="Plan to watch">Plan to watch</option>
          <option value="Dropped">Dropped</option>
        </select>

        <select>
          <option value="Title">Title</option>
          <option value="Score">Score</option>
        </select>

      </form>

      <div className="media-grid">
        {filteredList.map((media) => (
          <div key={media.id} className="media-entry">
            {editId == media.id ? (
              <form
                className="edit-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(media.id);
                }}
              >
                <select value={editScore} onChange={(e) => setScoreId(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>

                <select value={editStatus} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="Plan to watch">Plan to watch</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Dropped">Dropped</option>
                </select>


                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => {
                  setEditId("");
                  setScoreId("");
                }}>Cancel</button>



              </form>

            ) : (

              <div className="media-entry">
                <Link to={`/details/${media.anilist_id}`}>
                  <img src={media.coverImage} alt={media.title} className="media-image" />
                </Link>
                <div className="media-details">
                  <p className="media-title">
                    <Link to={`/details/${media.anilist_id}`}><strong>{media.title}</strong></Link></p>
                  <p><strong>Score:</strong> {media.score}</p>
                  <p><strong>Status:</strong> {media.status}</p>
                  <p><strong>Genre:</strong> {media.genres}</p>
                  <button onClick={() => {
                    setEditId(media.id);
                    setScoreId(media.score.toString());
                    setStatus(media.status);
                  }}>Edit</button>
                  <button onClick={() => handleDelete(media.id)}>Delete</button>
                </div>
              </div>

            )}


          </div>
        ))}

      </div>

    </div>
  );
}





function App() {
  return (
    <Router>
      <NavBar /> { }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/results" element={<SearchResults />} /> { }
      </Routes>
    </Router>
  );
}

export default App;
