
import React, { useState, useEffect } from "react";
import { addWord, getWords, updateWord, deleteWord } from "../services/api";

// Modern card style and spinner for interactive UI

function WordManager({ onLogout }) {
  const [text, setText] = useState("");
  const [definition, setDefinition] = useState("");
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const loadWords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getWords();
      setWords(res.data);
    } catch (err) {
      setError("Failed to load words.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addWord(text, "");
      setText("");
      setSuccess("Word added!");
      await loadWords();
    } catch (err) {
      setError("Failed to add word.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setEditText(w.text);
    setUpdateError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setUpdateError("");
  };

  const saveEdit = async (id) => {
    setUpdating(true);
    setUpdateError("");
    try {
      await updateWord(id, editText, "");
      cancelEdit();
      setSuccess("Word updated!");
      loadWords();
    } catch (err) {
      setUpdateError("Failed to update word. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError("");
    try {
      await deleteWord(id);
      setSuccess("Word deleted!");
      loadWords();
    } catch (err) {
      setError("Failed to delete word.");
    } finally {
      setLoading(false);
    }
  };

  // Filter words by search (by word)
  const filteredWords = words.filter(
    (w) => w.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: "#22223b", margin: 0 }}>Add Word</h2>
        <button
          type="button"
          onClick={loadWords}
          style={{ background: "#4a4e69", color: "#fff", border: 0, borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Word"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={loading || !text}
          style={{ background: "#4a4e69", color: "#fff", border: 0, borderRadius: 6, padding: "8px 18px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
        >
          Add
        </button>
      </form>
      <input
        placeholder="Search words..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
      />
      {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", marginBottom: 12 }}>{success}</div>}
      <h2 style={{ color: "#22223b", marginTop: 32 }}>My Words</h2>
      {loading ? (
        <div style={{ textAlign: "center", margin: 32 }}>
          <div className="spinner" style={{ width: 40, height: 40, border: "4px solid #eee", borderTop: "4px solid #4a4e69", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filteredWords.length === 0 ? (
        <div style={{ color: "#888", marginTop: 16 }}>No words found.</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 }}>
          {filteredWords.map((w) => (
            <div key={w.id} style={{ background: "#f2e9e4", borderRadius: 10, boxShadow: "0 2px 8px #22223b11", padding: 18, minWidth: 220, flex: "1 1 220px", display: "flex", flexDirection: "column", position: "relative" }}>
              {editingId === w.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ marginBottom: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => saveEdit(w.id)} disabled={updating} style={{ background: "#4a4e69", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }}>
                      {updating ? "Saving..." : "Save"}
                    </button>
                    <button onClick={cancelEdit} style={{ background: "#c9ada7", color: "#22223b", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }}>Cancel</button>
                  </div>
                  {updateError && <div style={{ color: "#b00020", marginTop: 8 }}>{updateError}</div>}
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, color: "#22223b", fontSize: 18 }}>{w.text}</div>
                  <div style={{ color: "#4a4e69", margin: "8px 0 12px 0", minHeight: 18 }}>
                    {w.definition ? w.definition : <span style={{ color: "#bbb" }}>No definition</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <button style={{ background: "#9a8c98", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }} onClick={() => startEdit(w)}>Edit</button>
                    <button style={{ background: "#b00020", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }} onClick={() => remove(w.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WordManager;
