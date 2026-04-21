/**
 * Predict Service (v3)
 * Communicates with Python ML service.
 */

const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

/**
 * Get prediction from Python ML API.
 */
async function getPrediction(params) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, params, {
      timeout: 5000, // 5 seconds timeout
    });

    return response.data;
  } catch (err) {
    console.error("[PredictService] Error calling Python ML:", err.message);
    throw new Error("ML Prediction service is currently unavailable.");
  }
}

module.exports = { getPrediction };
