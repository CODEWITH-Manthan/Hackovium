/**
 * API base instance — Axios client pointing at the Node.js backend.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("solsense_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
