import React from "react";

export default function Layout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f6f8fa",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <header style={{
        background: "#22223b",
        color: "#fff",
        padding: "1.5rem 2rem",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px #22223b22"
      }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: "2rem" }}>AI Dictionary</h1>
      </header>
      <main style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #22223b11", padding: 32 }}>
        {children}
      </main>
    </div>
  );
}
