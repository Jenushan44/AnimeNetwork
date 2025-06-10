import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stores any error message that happend during the login
  const [loading, setLoading] = useState(false); // Checks whether login is in progress
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault(); // Prevents reload
    if (loading) return; // if login is in progree, then prevent user from clicking button again
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google user: ", result.user);
        navigate('/');
      })
      .catch((error) => {
        console.error("Google login error: ", error.message);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }



  return (
    <div className="register-container">
      <h1 className="register-title">Login</h1>

      <form className="register-form" onSubmit={handleSubmit}>


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


        {error && <p className="login-error">{error}</p>}

        <button type='submit' className="primary-button" disabled={loading}>
          Login
        </button>
        <button type='button' className="google-button" onClick={handleGoogleLogin} disabled={loading}>
          Login with Google
        </button>
      </form>
    </div>
  );
}



export default LoginPage;