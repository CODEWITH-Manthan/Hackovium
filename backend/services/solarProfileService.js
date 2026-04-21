/**
 * Solar Profile Service v2 (PostgreSQL)
 * Manages solar panel configurations for authenticated users
 */

const pool = require('../config/database');

/**
 * Initialize database - now just a placeholder for connection check
 */
async function initDatabase() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('[SolarProfileService] Database initialized and connected');
  } catch (err) {
    console.error('[SolarProfileService] Database initialization error:', err);
  }
}

/**
 * Create a new solar profile for a user
 * @param {string} userId - The user's ID
 * @param {Object} data - Profile data
 * @returns {Object} - Created profile with ID
 */
async function createProfile(userId, data) {
  try {
    const result = await pool.query(
      `INSERT INTO solar_profiles 
       (user_id, profile_name, panel_capacity, panel_efficiency, tilt_angle, location_city, estimated_generation) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, user_id AS "userId", profile_name AS "profileName", 
                 panel_capacity AS "panelCapacity", panel_efficiency AS "panelEfficiency", 
                 tilt_angle AS "tiltAngle", location_city AS "locationCity", 
                 estimated_generation AS "estimatedGeneration", created_at AS "createdAt"`,
      [
        userId,
        data.profileName,
        data.panelCapacity,
        data.panelEfficiency || 18,
        data.tiltAngle || 30,
        data.locationCity,
        data.estimatedGeneration || 0
      ]
    );

    console.log(`[SolarProfileService] Created profile: ${result.rows[0].id}`);
    return result.rows[0];
  } catch (err) {
    console.error('[SolarProfileService] Create error:', err.message);
    throw err;
  }
}

/**
 * List all solar profiles for a specific user
 * @param {string} userId - The user's ID
 * @returns {Array} - Array of profiles
 */
async function listProfiles(userId) {
  try {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", profile_name AS "profileName", 
              panel_capacity AS "panelCapacity", panel_efficiency AS "panelEfficiency", 
              tilt_angle AS "tiltAngle", location_city AS "locationCity", 
              estimated_generation AS "estimatedGeneration",
              created_at AS "createdAt", updated_at AS "updatedAt" 
       FROM solar_profiles 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  } catch (err) {
    console.error('[SolarProfileService] List error:', err.message);
    throw err;
  }
}

/**
 * Get a specific profile (with user verification)
 * @param {string} userId - The user's ID
 * @param {string} profileId - The profile's ID
 * @returns {Object} - Profile data
 */
async function getProfile(userId, profileId) {
  try {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", profile_name AS "profileName", 
              panel_capacity AS "panelCapacity", panel_efficiency AS "panelEfficiency", 
              tilt_angle AS "tiltAngle", location_city AS "locationCity", 
              estimated_generation AS "estimatedGeneration",
              created_at AS "createdAt", updated_at AS "updatedAt" 
       FROM solar_profiles 
       WHERE id = $1 AND user_id = $2`,
      [profileId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Profile not found or access denied.');
    }

    return result.rows[0];
  } catch (err) {
    console.error('[SolarProfileService] Get error:', err.message);
    throw err;
  }
}

/**
 * Update a solar profile
 * @param {string} userId - The user's ID
 * @param {string} profileId - The profile's ID
 * @param {Object} data - Updated data
 * @returns {Object} - Updated profile
 */
async function updateProfile(userId, profileId, data) {
  try {
    const result = await pool.query(
      `UPDATE solar_profiles 
       SET profile_name = COALESCE($1, profile_name),
           panel_capacity = COALESCE($2, panel_capacity),
           panel_efficiency = COALESCE($3, panel_efficiency),
           tilt_angle = COALESCE($4, tilt_angle),
           location_city = COALESCE($5, location_city),
           estimated_generation = COALESCE($6, estimated_generation),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING id, user_id AS "userId", profile_name AS "profileName", 
                 panel_capacity AS "panelCapacity", panel_efficiency AS "panelEfficiency", 
                 tilt_angle AS "tiltAngle", location_city AS "locationCity", 
                 estimated_generation AS "estimatedGeneration",
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        data.profileName || null,
        data.panelCapacity || null,
        data.panelEfficiency || null,
        data.tiltAngle || null,
        data.locationCity || null,
        data.estimatedGeneration || null,
        profileId,
        userId
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Profile not found or access denied.');
    }

    console.log(`[SolarProfileService] Updated profile: ${profileId}`);
    return result.rows[0];
  } catch (err) {
    console.error('[SolarProfileService] Update error:', err.message);
    throw err;
  }
}

/**
 * Delete a solar profile
 * @param {string} userId - The user's ID
 * @param {string} profileId - The profile's ID
 * @returns {Object} - { success, message }
 */
async function deleteProfile(userId, profileId) {
  try {
    const result = await pool.query(
      'DELETE FROM solar_profiles WHERE id = $1 AND user_id = $2 RETURNING id',
      [profileId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Profile not found or access denied.');
    }

    console.log(`[SolarProfileService] Deleted profile: ${profileId}`);
    return { success: true, message: 'Profile deleted successfully.' };
  } catch (err) {
    console.error('[SolarProfileService] Delete error:', err.message);
    throw err;
  }
}

module.exports = { 
  initDatabase, 
  createProfile, 
  listProfiles, 
  getProfile,
  updateProfile, 
  deleteProfile 
};
