/**
 * Auth Routes
 * POST /api/register
 * POST /api/login
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
