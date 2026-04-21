/**
 * Solar Profile Controller v2 (PostgreSQL)
 * POST   /api/solar-profile         — create profile
 * GET    /api/solar-profile         — list all profiles for user
 * GET    /api/solar-profile/:id     — get single profile
 * PUT    /api/solar-profile/:id     — update profile
 * DELETE /api/solar-profile/:id     — delete profile
 */

const profileService = require("../services/solarProfileService");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { profileName, panelCapacity, panelEfficiency, tiltAngle, locationCity, estimatedGeneration } = req.body;

    if (!profileName || !panelCapacity || !locationCity) {
      return res.status(400).json({
        error: "Fields required: profileName, panelCapacity, locationCity.",
      });
    }

    const profile = await profileService.createProfile(userId, {
      profileName,
      panelCapacity: Number(panelCapacity),
      panelEfficiency: Number(panelEfficiency) || 18,
      tiltAngle: Number(tiltAngle) || 30,
      locationCity,
      estimatedGeneration: Number(estimatedGeneration) || 0
    });

    return res.status(201).json(profile);
  } catch (err) {
    console.error("[ProfileController] Create Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.listProfiles = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const profiles = await profileService.listProfiles(userId);
    return res.json(profiles);
  } catch (err) {
    console.error("[ProfileController] List Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;

    const profile = await profileService.getProfile(userId, id);
    return res.json(profile);
  } catch (err) {
    console.error("[ProfileController] Get Error:", err.message);
    const status = err.message.includes("not found") ? 404 : 500;
    return res.status(status).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    const { profileName, panelCapacity, panelEfficiency, tiltAngle, locationCity, estimatedGeneration } = req.body;

    const profile = await profileService.updateProfile(userId, id, {
      profileName,
      panelCapacity: panelCapacity ? Number(panelCapacity) : null,
      panelEfficiency: panelEfficiency ? Number(panelEfficiency) : null,
      tiltAngle: tiltAngle ? Number(tiltAngle) : null,
      locationCity,
      estimatedGeneration: estimatedGeneration ? Number(estimatedGeneration) : null,
    });

    return res.json(profile);
  } catch (err) {
    console.error("[ProfileController] Update Error:", err.message);
    const status = err.message.includes("not found") ? 404 : 500;
    return res.status(status).json({ error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;

    console.log(`[ProfileController] Deleting profile: ${id} for user: ${userId}`);
    const result = await profileService.deleteProfile(userId, id);
    return res.json({ ...result, deletedId: id });
  } catch (err) {
    console.error("[ProfileController] Delete Error:", err.message);
    const status = err.message.includes("not found") ? 404 : 500;
    return res.status(status).json({ error: err.message });
  }
};
