import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate() // Redirects to page
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Disables buttons that tracks if login is currently running 
  const [username, setUsername] = useState("");

  function handleSubmit(e) {
    if (loading) return; // Prevents user from double clicking

    setLoading(true);

    e.preventDefault(); // Stops the page from reloading
    if (!email || !password || !username) {
      setError("Please fill in username, email and password"); // Verfies that both password and email field are filled
      return;
    }
    createUserWithEmailAndPassword(auth, email.trim(), password)
      // Trim accidental whitespace after user enters email
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        navigate("/"); // On successful registration, redirects to home page
      })
      .catch((err) => {
        setError(err.message);
      })
  }

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    // Starts sign-in with popup through google
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google user: ", result.user); // If login successful, result.user will hold all information such as name, email etc.
        navigate('/') // redirect to home page
      })
      .catch((error) => {
        console.error("Google login error: ", error.message);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false); // stops loading after sucess or error
      })

  }


  return (
    <div className="register-container">
      <h1 className="register-title">Sign up</h1>

      <form className="register-form" onSubmit={handleSubmit}>

        <label htmlFor='username'>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a username"
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />


        {error && <p className="register-error">{error}</p>}

        <button type='submit' className="primary-button" disabled={loading}>
          Register
        </button>
        <button type='button' className="google-button" onClick={handleGoogleLogin} disabled={loading}>
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;