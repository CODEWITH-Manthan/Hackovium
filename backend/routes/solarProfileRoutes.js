/**
 * Solar Profile Routes
 * All routes require authentication
 * POST   /api/solar-profile       — create a profile
 * GET    /api/solar-profile       — list all profiles
 * GET    /api/solar-profile/:id   — get a specific profile
 * PUT    /api/solar-profile/:id   — update a profile
 * DELETE /api/solar-profile/:id   — delete a profile
 */

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/solarProfileController");
const { authenticate } = require("../middleware/authMiddleware");

// All routes require authentication
router.post("/", authenticate, profileController.createProfile);
router.get("/", authenticate, profileController.listProfiles);
router.get("/:id", authenticate, profileController.getProfile);
router.put("/:id", authenticate, profileController.updateProfile);
router.delete("/:id", authenticate, profileController.deleteProfile);

module.exports = router;
