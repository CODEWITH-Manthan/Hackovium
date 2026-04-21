const express = require("express");
const router = express.Router();
const enodeController = require("../controllers/enodeController");
const { authenticate } = require("../middleware/authMiddleware");

// Route to fetch real-time inverter data
router.get("/inverter-data", enodeController.getActualData);

module.exports = router;
