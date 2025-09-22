




import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import WordManager from "./components/WordManager";
import { logout, getUsername } from "./services/api";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt_token"));
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState(getUsername());

  useEffect(() => {
    if (localStorage.getItem("jwt_token")) {
      setLoggedIn(true);
      setUsername(getUsername());
    }
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUsername("");
  };

  const handleLogin = () => {
    setLoggedIn(true);
    setUsername(getUsername());
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #22223b11" }}>
      <h1 style={{ textAlign: "center", color: "#22223b", marginBottom: 32 }}>AI Dictionary</h1>
      {loggedIn ? (
        <>
          <div style={{ textAlign: "right", marginBottom: 12, color: "#4a4e69", fontWeight: 600 }}>
            Welcome, {username}!
          </div>
          <WordManager onLogout={handleLogout} />
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <button onClick={handleLogout} style={{ background: "#c9ada7", color: "#22223b", border: 0, borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>Logout</button>
          </div>
        </>
      ) : showRegister ? (
        <>
          <Register onRegister={() => setShowRegister(false)} />
          <p style={{ textAlign: "center", marginTop: 16 }}>
            Already have an account?{' '}
            <button onClick={() => setShowRegister(false)} style={{ background: "none", color: "#4a4e69", border: 0, textDecoration: "underline", cursor: "pointer" }}>Login</button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <p style={{ textAlign: "center", marginTop: 16 }}>
            Dont have an account?{' '}
            <button onClick={() => setShowRegister(true)} style={{ background: "none", color: "#4a4e69", border: 0, textDecoration: "underline", cursor: "pointer" }}>Register</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
