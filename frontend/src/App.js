import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import WordManager from "./components/WordManager";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      <h1>AI Dictionary</h1>

      {loggedIn ? (
        <WordManager />
      ) : showRegister ? (
        <>
          <Register onRegister={() => setShowRegister(false)} />
          <p>
            Already have an account?{" "}
            <button onClick={() => setShowRegister(false)}>Login</button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={() => setLoggedIn(true)} />
          <p>
            Don’t have an account?{" "}
            <button onClick={() => setShowRegister(true)}>Register</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
