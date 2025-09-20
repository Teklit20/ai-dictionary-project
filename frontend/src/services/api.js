import axios from "axios";

const API_AUTH = "http://localhost:8081/api/auth";
const API_WORDS = "http://localhost:8082/api/words"; 

let token = null;

export function setToken(jwt) {
  token = jwt;
}

export function register(username, password) {
  return axios.post(`${API_AUTH}/register`, { username, password });
}

export function login(username, password) {
  return axios.post(`${API_AUTH}/login`, { username, password });
}

export function addWord(text, definition) {
  return axios.post(
    API_WORDS,
    { text, definition },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function getWords() {
  return axios.get(API_WORDS, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
