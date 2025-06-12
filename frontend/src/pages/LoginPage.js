import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth"; // Sends a reset email to the user


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stores any error message that happend during the login
  const [loading, setLoading] = useState(false); // Checks whether login is in progress
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Allows switching between login and signup

  function getFirebaseErrorMessage(code) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return "Incorrect email or password.";
      case 'auth/too-many-requests':
        return "Too many failed attempts. Please try again later.";
      case 'auth/email-already-in-use':
        return "Email is already registered. Please log in instead.";
      case 'auth/invalid-email':
        return "Invalid email address.";
      case 'auth/weak-password':
        return "Password should be at least 6 characters.";
      case 'auth/popup-closed-by-user':
        return "Google sign-in was cancelled.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

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

    if (isLogin) {
      setPersistence(auth, browserSessionPersistence) // Logs user out when browser/tab is closed
        .then(() => {
          return signInWithEmailAndPassword(auth, email.trim(), password);
        })
        .then(() => navigate("/"))
        .catch(err => setError(getFirebaseErrorMessage(err.code)))
        .finally(() => setLoading(false));
    } else {
      createUserWithEmailAndPassword(auth, email.trim(), password)
        .then(() => navigate("/"))
        .catch(err => setError(getFirebaseErrorMessage(err.code)))
        .finally(() => setLoading(false));
    }

  }

  function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

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

  function handleForgotPassword() {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    sendPasswordResetEmail(auth, email.trim())
      .then(() => {
        setError("Password reset email sent.");
      })
      .catch((err) => {
        setError(getFirebaseErrorMessage(err.code));
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

        <div className="forgot-password-container">
          <button type="button" onClick={handleForgotPassword} className="forgot-password-button">Forgot Password?</button>
        </div>


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