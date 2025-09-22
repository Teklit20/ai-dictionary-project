
import React, { useState, useEffect } from "react";
import { addWord, getWords, updateWord, deleteWord } from "../services/api";

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

  useEffect(() => { loadWords(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addWord(text, definition);
      setText("");
      setDefinition("");
      setSuccess("Word added!");
      loadWords();
    } catch (err) {
      setError("Failed to add word.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setEditText(w.text);
    setEditDefinition(w.definition || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditDefinition("");
  };

  const saveEdit = async (id) => {
    setLoading(true);
    setError("");
    try {
      await updateWord(id, editText, editDefinition);
      cancelEdit();
      setSuccess("Word updated!");
      loadWords();
    } catch (err) {
      setError("Failed to update word.");
    } finally {
      setLoading(false);
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

  return (
    <div>
      <h2 style={{ color: "#22223b", marginBottom: 16 }}>Add Word</h2>
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
      {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", marginBottom: 12 }}>{success}</div>}
      <h2 style={{ color: "#22223b", marginTop: 32 }}>My Words</h2>
      {loading ? (
        <div>Loading...</div>
      ) : words.length === 0 ? (
        <div style={{ color: "#888", marginTop: 16 }}>No words found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
          {words.map((w) => (
            <li key={w.id} style={{ marginBottom: 12, background: "#f2e9e4", borderRadius: 8, padding: 12, display: "flex", alignItems: "center" }}>
              {editingId === w.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ marginRight: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                  />
                  <input
                    value={editDefinition}
                    onChange={(e) => setEditDefinition(e.target.value)}
                    style={{ marginRight: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
                  />
                  <button onClick={() => saveEdit(w.id)} style={{ background: "#4a4e69", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600, marginRight: 6 }}>Save</button>
                  <button onClick={cancelEdit} style={{ background: "#c9ada7", color: "#22223b", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }}>Cancel</button>
                </>
              ) : (
                <>
                  <b style={{ color: "#22223b" }}>{w.text}</b>
                  <span style={{ margin: "0 10px", color: "#4a4e69" }}>:</span>
                  <span style={{ flex: 1 }}>{w.definition}</span>
                  <button style={{ marginLeft: 8, background: "#9a8c98", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }} onClick={() => startEdit(w)}>Edit</button>
                  <button style={{ marginLeft: 6, background: "#b00020", color: "#fff", border: 0, borderRadius: 6, padding: "6px 14px", fontWeight: 600 }} onClick={() => remove(w.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WordManager;
