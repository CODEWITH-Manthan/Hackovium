/**
 * Auth Service — frontend API calls
 */

import api from "./api";

/**
 * Register a new user.
 */
export async function registerUser(username, password) {
  const res = await api.post("/register", { username, password });
  return res.data;
}

/**
 * Login a user and store the token.
 */
export async function loginUser(username, password) {
  const res = await api.post("/login", { username, password });
  if (res.data.token) {
    localStorage.setItem("solsense_token", res.data.token);
    localStorage.setItem("solsense_user", username);
  }
  return res.data;
}

/**
 * Logout — clear stored credentials.
 */
export function logout() {
  localStorage.removeItem("solsense_token");
  localStorage.removeItem("solsense_user");
}

/**
 * Check if user is logged in.
 */
export function isAuthenticated() {
  return !!localStorage.getItem("solsense_token");
}

/**
 * Get current username.
 */
export function getCurrentUser() {
  const username = localStorage.getItem("solsense_user");
  return username ? { username } : null;
}
// Aliases for compatibility with v5 components
export const register = registerUser;
export const login = loginUser;
