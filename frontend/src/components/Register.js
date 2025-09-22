
import React, { useState } from "react";
import { register } from "../services/api";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await register(username, password);
      setSuccess(true);
      setTimeout(() => {
        onRegister();
      }, 1200);
    } catch (err) {
      setError("Registration failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ textAlign: "center", color: "#22223b" }}>Register</h2>
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
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <div style={{ color: "#b00020", textAlign: "center" }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", textAlign: "center" }}>Registration successful!</div>}
    </form>
  );
}

export default Register;
