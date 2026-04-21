/**
 * Weather Routes
 * GET /api/weather?city=Mumbai
 */

const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/", weatherController.getWeather);

module.exports = router;
