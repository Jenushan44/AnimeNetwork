import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DetailPage from './DetailPage.js';
import React, { useState, useEffect, useRef } from 'react';
import NavBar from "./NavBar";
import SearchResults from "./SearchResults";
import useHorizontalScroll from "./hooks/useHorizontalScroll.js";
import RegisterPage from './RegisterPage';
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LoginPage from "./LoginPage";
import Popup from "./components/Popup";
import { getCurrentSeason, formatDate } from './utils/date';


function Home() {

  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]); // Initialize state where list of trending anime is stored
  const [animeList, setAnimeList] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const featured = trending[bannerIndex]; // the most trending anime
  const [category, setCategory] = useState("airing");
  const [currentList, setCurrentList] = useState("all");
  const { gridRef, scrollLeft, scrollRight } = useHorizontalScroll();

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
    } else if (category === "next-season") {
      url = "http://localhost:5000/anilist/nextseason";
    }
    else {
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
          <button onClick={() => setCategory("airing")} className="airing-title"> Airing Now </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("spring")} className="spring-title"> Spring </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("summer")} className="summer-title"> Summer </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("winter")} className="winter-title"> Winter </button>
          <div className="vertical-divider">|</div>
          <button onClick={() => setCategory("next-season")} className="next-season-title"> Next Season </button>
        </div>

        <div className='season-layout'>
          <div className='airing-wrap'>
            <button className='scroll-left' onClick={scrollLeft}>{'<'}</button>
            <div className='airing-grid' ref={gridRef}>
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
            <button className="scroll-right" onClick={scrollRight}>{'>'}</button>
          </div>
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
      const user = auth.currentUser;
      if (!user) return; // Checks if a user is logged in

      const token = await user.getIdToken();

      const result = await fetch("http://localhost:5000/profile", { // Sends a GET request to Flask backend at /profile and retrieves all data 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // attaches firebase ID token using Bearer token format
        }
      });

      const data = await result.json();
      setTotalTime(data.total);
      setTotalEpisode(data.episodes);
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

function List({ editStatus, setStatus }) {
  const [mediaList, setMediaList] = useState([]);
  const [editId, setEditId] = useState('');
  const [editScore, setScoreId] = useState('');
  const [filterStatus, editFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("") // stores selected filter
  const location = useLocation(); // gives information about current URL/page
  const scrollReference = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:5000/list", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }

      });
      const data = await response.json();
      setMediaList(data);

      if (scrollReference.current) {
        scrollReference.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const editId = location.state?.editId;
      if (editId && scrollReference.current) {
        scrollReference.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

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

  function getStatusClass(status) {
    if (!status) return "";
    return "status-" + status.toLowerCase().replaceAll(" ", "-");
  }

  const sortedList = getSortedList(filteredList, sortBy);

  function getSortedList(filteredList, sortBy) {
    let sortedList = [...filteredList]; // Creates a copy of the original list

    if (sortBy == 'Title (A-Z)') {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (sortBy == 'Title (Z-A)') {
      sortedList.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy == 'Score (Descending)') {
      sortedList.sort((a, b) => {
        const scoreA = a.score === "-" ? 0 : a.score;
        const scoreB = b.score === "-" ? 0 : b.score;
        return scoreB - scoreA;
      });
    } else if (sortBy == 'Score (Ascending)') {
      sortedList.sort((a, b) => {
        const scoreA = a.score === "-" ? 0 : a.score;
        const scoreB = b.score === "-" ? 0 : b.score;
        return scoreA - scoreB;
      })
    } else if (sortBy == 'Oldest Added') {
      sortedList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy == 'Newest Added') {
      sortedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sortedList
  }

  return (
    <div>
      <h1 className='list-title'>My List</h1>
      <div className='list-buttons'>

        <button onClick={() => editFilterStatus("All")} className='all-button'> All </button>
        <button onClick={() => editFilterStatus("Watching")} className='watching-button'> Watching </button>
        <button onClick={() => editFilterStatus("Completed")} className='completed-button'> Completed </button>
        <button onClick={() => editFilterStatus("On Hold")} className='on-hold-button'> On Hold </button>
        <button onClick={() => editFilterStatus("Plan to watch")} className='plan-to-watch-button'> Plan To Watch </button>
        <button onClick={() => editFilterStatus("Dropped")} className='dropped-button'> Dropped </button>
      </div>

      <div className='filter-option'>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='list-filter'>
          <option value="Title (A-Z)">Title (A-Z)</option>
          <option value="Title (Z-A)">Title (Z-A)</option>
          <option value="Score (Ascending)">Score (Ascending)</option>
          <option value="Score (Descending)">Score (Descending)</option>
          <option value="Oldest Added">Oldest Added</option>
          <option value="Newest Added">Newest Added</option>

        </select>

      </div>


      <div className="media-grid">

        {sortedList.map((media) => (
          <div key={media.id} className="media-entry" ref={location.state?.editId === media.anilist_id ? scrollReference : null}>
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
                <div className='list-status'>
                  <select value={editStatus} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Plan to watch">Plan to watch</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>

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
                  <p className='center-title'>
                    <Link to={`/details/${media.anilist_id}`} className='media-title'>
                      <strong>{media.title?.length > 25
                        ? media.title.slice(0, 22) + "..."
                        : media.title}</strong>
                    </Link>
                  </p>
                  <p className='score-list'><strong>Score:</strong> {media.score}</p>
                  <p className='status-list'>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${getStatusClass(media.status)}`}>
                      {media.status}
                    </span>
                  </p>
                  <p className='type-list'><strong>Type:</strong> {media.format}</p>
                  <button className="edit-list-button" onClick={() => {
                    setEditId(media.id);
                    setScoreId(media.score.toString());
                    setStatus(media.status);
                  }}>Edit</button>
                  <button className="delete-list-button" onClick={() => handleDelete(media.id)}>Delete</button>
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
  const [editStatus, setStatus] = useState('');
  const [user, setUser] = useState(null); // store currently authenticated Firebase user
  // Initially set to null meaning noone is logged in
  const [popupMsg, setPopupMsg] = useState(null);

  useEffect(() => { // Checks whether user is logged-in or not and keeps checking to update latest login status
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signedout");
      })
      .catch((error) => {
        console.error("Logout error: ", error.message);
      });
  }

  return (
    <>
      {popupMsg && <Popup message={popupMsg} onClose={() => setPopupMsg(null)} />}
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List editStatus={editStatus} setStatus={setStatus} />} />
        <Route path="/details/:id" element={<DetailPage editStatus={editStatus} setStatus={setStatus} setPopupMsg={setPopupMsg} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/results" element={<SearchResults />} /> { }
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
