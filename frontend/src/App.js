



import React, { useState } from "react";
import WordManager from "./components/WordManager";
import Login from "./components/Login";
import Register from "./components/Register";
import { getUsername, logout } from "./services/api";


function App() {
  const [user, setUser] = useState(getUsername());
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setUser(getUsername());
  };

  const handleLogout = () => {
    logout();
    setUser("");
  };

  const handleRegister = () => {
    setShowRegister(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      {!user ? (
        <div style={{ maxWidth: 350, margin: "60px auto" }}>
          {showRegister ? (
            <>
              <Register onRegister={handleRegister} />
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <button onClick={() => setShowRegister(false)} style={{ background: "none", color: "#4a4e69", border: 0, textDecoration: "underline", cursor: "pointer" }}>
                  Already have an account? Login
                </button>
              </div>
            </>
          ) : (
            <>
              <Login onLogin={handleLogin} />
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <button onClick={() => setShowRegister(true)} style={{ background: "none", color: "#4a4e69", border: 0, textDecoration: "underline", cursor: "pointer" }}>
                  Don't have an account? Register
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div style={{ fontWeight: 600, color: "#22223b", fontSize: 18 }}>
              Welcome, {user}!
            </div>
            <button onClick={handleLogout} style={{ background: "#b00020", color: "#fff", border: 0, borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: "pointer" }}>
              Logout
            </button>
          </div>
          <WordManager onLogout={handleLogout} />
        </>
      )}
    </div>
  );
}

export default App;
