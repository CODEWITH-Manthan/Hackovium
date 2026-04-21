/**
 * Profile Service v2 (PostgreSQL) — frontend API calls
 */

import api from "./api";

/**
 * Create a new solar profile.
 * @param {Object} profileData - { profileName, panelCapacity, panelEfficiency, tiltAngle, locationCity }
 * @returns {Promise<Object>} - Created profile with ID
 */
export async function createProfile(profileData) {
  const res = await api.post("/solar-profile", profileData);
  return res.data;
}

/**
 * Get all solar profiles for the authenticated user.
 * @returns {Promise<Array>} - Array of profiles
 */
export async function listProfiles() {
  const res = await api.get("/solar-profile");
  return res.data;
}

/**
 * Get a specific solar profile by ID.
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} - Profile data
 */
export async function getProfile(id) {
  const res = await api.get(`/solar-profile/${id}`);
  return res.data;
}

/**
 * Update a solar profile.
 * @param {string} id - Profile ID
 * @param {Object} profileData - Updated profile data (partial)
 * @returns {Promise<Object>} - Updated profile
 */
export async function updateProfile(id, profileData) {
  const res = await api.put(`/solar-profile/${id}`, profileData);
  return res.data;
}

/**
 * Delete a solar profile.
 * @param {string} id - Profile ID
 * @returns {Promise<Object>} - { success, message, deletedId }
 */
export async function deleteProfile(id) {
  const res = await api.delete(`/solar-profile/${id}`);
  return res.data;
}
