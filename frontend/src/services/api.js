import axios from "axios";

const API_AUTH = "http://localhost:8081/api/auth";
const API_WORDS = "http://localhost:8082/api/words"; 



let token = localStorage.getItem("jwt_token");


export function setToken(jwt, username) {
  token = jwt;
  if (jwt) {
    localStorage.setItem("jwt_token", jwt);
    if (username) localStorage.setItem("username", username);
  } else {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
  }
}

export function getUsername() {
  return localStorage.getItem("username") || "";
}

export function logout() {
  token = null;
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("username");
}

export function register(username, password) {
  return axios.post(`${API_AUTH}/register`, { username, password });
}

export function login(username, password) {
  return axios.post(`${API_AUTH}/login`, { username, password });
}

function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function addWord(text, definition) {
  return axios.post(
    API_WORDS,
    { text, definition },
    { headers: authHeaders() }
  );
}

export function getWords() {
  return axios.get(API_WORDS, {
    headers: authHeaders(),
  });
}

export function updateWord(id, text, definition) {
  return axios.put(
    `${API_WORDS}/${id}`,
    { text, definition },
    { headers: authHeaders() }
  );
}

export function deleteWord(id) {
  return axios.delete(`${API_WORDS}/${id}`, {
    headers: authHeaders(),
  });
}
