/**
 * Predict Routes
 * POST /api/predict
 */

const express = require("express");
const router = express.Router();
const predictController = require("../controllers/predictController");

router.post("/", predictController.predict);
router.get("/cities", predictController.listCities);
router.post("/export-csv", predictController.exportCSV);

module.exports = router;
