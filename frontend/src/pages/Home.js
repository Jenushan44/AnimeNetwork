import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import { getCurrentSeason, formatDate } from "../utils/date";

function Home() {

  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]); // Initialize state where list of trending anime is stored
  const [animeList, setAnimeList] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const featured = trending[bannerIndex]; // the most trending anime
  const [category, setCategory] = useState("airing");
  const [currentList, setCurrentList] = useState("all");
  const { gridRef, scrollLeft, scrollRight } = useHorizontalScroll();
  const [popupMessage, setPopupMessage] = useState("");

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
}

export default Home;
