import React, { useState, useEffect } from "react";
import { addWord, getWords, updateWord, deleteWord } from "../services/api";

function WordManager() {
  const [text, setText] = useState("");
  const [definition, setDefinition] = useState("");
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDefinition, setEditDefinition] = useState("");

  const loadWords = async () => {
    const res = await getWords();
    setWords(res.data);
  };

  useEffect(() => { loadWords(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addWord(text, definition);
    setText("");
    setDefinition("");
    loadWords();
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
    await updateWord(id, editText, editDefinition);
    cancelEdit();
    loadWords();
  };

  const remove = async (id) => {
    await deleteWord(id);
    loadWords();
  };

  return (
    <div>
      <h2>Add Word</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Word" value={text} onChange={(e) => setText(e.target.value)} />
        <input placeholder="Definition" value={definition} onChange={(e) => setDefinition(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <h2>My Words</h2>
      <ul>
        {words.map((w) => (
          <li key={w.id} style={{ marginBottom: 8 }}>
            {editingId === w.id ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <input value={editDefinition} onChange={(e) => setEditDefinition(e.target.value)} />
                <button onClick={() => saveEdit(w.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <b>{w.text}</b>: {w.definition}
                <button style={{ marginLeft: 8 }} onClick={() => startEdit(w)}>Edit</button>
                <button style={{ marginLeft: 6 }} onClick={() => remove(w.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordManager;
