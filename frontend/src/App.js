import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import NavBar from "./components/NavBar";
import Popup from "./components/Popup";
import Home from "./pages/Home";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import SearchResults from "./pages/SearchResults";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { auth } from "./firebase";

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
      <NavBar user={user} setPopupMessage={setPopupMsg} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<ListPage editStatus={editStatus} setStatus={setStatus} />} />
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
