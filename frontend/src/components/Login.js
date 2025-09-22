
import React, { useState } from "react";
import { login, setToken } from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
  const res = await login(username, password);
  setToken(res.data.token, username);
  onLogin();
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ textAlign: "center", color: "#22223b" }}>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        autoFocus
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ background: "#4a4e69", color: "#fff", border: 0, borderRadius: 6, padding: "10px 0", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div style={{ color: "#b00020", textAlign: "center" }}>{error}</div>}
    </form>
  );
}

export default Login;
