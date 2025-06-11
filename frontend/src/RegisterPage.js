import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate() // Redirects to page
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Disables buttons that tracks if login is currently running 
  const [username, setUsername] = useState("");

  function getFirebaseErrorMessage(code) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return "Incorrect email or password.";
      case 'auth/too-many-requests':
        return "Too many failed attempts. Please try again later.";
      case 'auth/email-already-in-use':
        return "Email is already in use.";
      case 'auth/invalid-email':
        return "Invalid email address.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/popup-closed-by-user':
        return "Google sign-in was cancelled.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  }

  function handleSubmit(e) {
    if (loading) return; // Prevents user from double clicking

    setLoading(true);

    e.preventDefault(); // Stops the page from reloading
    if (!email || !password || !username) {
      setError("Please fill in username, email and password"); // Verfies that both password and email field are filled
      return;
    }
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(auth, email.trim(), password);
      })
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(getFirebaseErrorMessage(err.code));
      })
      .finally(() => {
        setLoading(false);
      });

  }

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    // Starts sign-in with popup through google
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      })
      .then((result) => {
        console.log("Google user: ", result.user);
        navigate('/');
      })
      .catch((error) => {
        setError(getFirebaseErrorMessage(error.code));
      })
      .finally(() => {
        setLoading(false);
      });

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