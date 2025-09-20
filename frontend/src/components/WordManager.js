import React, { useState, useEffect } from "react";
import { addWord, getWords } from "../services/api";

function WordManager() {
  const [text, setText] = useState("");
  const [definition, setDefinition] = useState("");
  const [words, setWords] = useState([]);

  const loadWords = async () => {
    const res = await getWords();
    setWords(res.data);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addWord(text, definition);
    setText("");
    setDefinition("");
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
          <li key={w.id}>
            <b>{w.text}</b>: {w.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordManager;
