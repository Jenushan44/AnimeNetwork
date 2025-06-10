import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate() // Redirects to page
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Disables buttons that tracks if login is currently running 

  function handleSubmit(e) {
    if (loading) return; // Prevents user from double clicking

    setLoading(true);

    e.preventDefault(); // Stops the page from reloading
    if (!email || !password) {
      setError("Please fill in both email and password"); // Verfies that both password and email field are filled
      return;
    }
    createUserWithEmailAndPassword(auth, email.trim(), password)
      // Trim accidental whitespace after user enters email
      .then((userCredential) => {
        console.log("user created: ", userCredential.user)
        navigate("/"); // On successful registration, redirects to home page
      })
      .catch((err) => {
        console.error("Error: ", err.message);
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
    <div>
      <h1>Register</h1>

      <form onSubmit={(handleSubmit)}>
        <p>Enter email: </p>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <p>You typed {email}</p>

        <p>Enter password: </p>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}


        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </form>



    </div>

  );
}

export default RegisterPage;