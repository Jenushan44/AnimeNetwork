import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from "react-router-dom";
import { auth } from "../firebase";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


function ListPage({ editStatus, setStatus }) {
  const [mediaList, setMediaList] = useState([]);
  const [editId, setEditId] = useState('');
  const [editScore, setScoreId] = useState('');
  const [filterStatus, editFilterStatus] = useState("All")
  const [sortBy, setSortBy] = useState("") // stores selected filter
  const scrollReference = useRef(null);
  const location = useLocation();

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
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    await fetch(`http://localhost:5000/list/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ score: Number(editScore), status: editStatus }),
    });
    setEditId("");
    setScoreId("");

    const response = await fetch("http://localhost:5000/list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    setMediaList(data);
  };


  // Function deletes anime from the list by sending a DELETE rquest using fetch() to the backend 
  // including the anime's ID meaning headers/body needed since no additional data is required 
  // After the request is successful, it updates the local list by removing the deleted anime 
  const handleDelete = async (idDelete) => {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    await fetch(`http://localhost:5000/list/${idDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Authorization needed to verify which user is making the request
      }
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

  const sortedList = getSortedList(filteredList || [], sortBy);

  function getSortedList(filteredList, sortBy) {
    if (!Array.isArray(filteredList)) return [];

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
                    setScoreId(media.score != null ? media.score.toString() : "");
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

export default ListPage;