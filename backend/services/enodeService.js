/**
 * Enode Service (v1)
 * Integrates with Enode API to fetch real-time inverter data.
 * Includes a demo mode for presentations.
 */

const axios = require("axios");

const CLIENT_ID = process.env.ENODE_CLIENT_ID;
const CLIENT_SECRET = process.env.ENODE_CLIENT_SECRET;
const BASE_URL = process.env.ENODE_BASE_URL || "https://api.enode.io";

let accessToken = null;
let tokenExpiry = null;

/**
 * Fetch OAuth token from Enode
 */
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // If keys are placeholders, return null to trigger demo mode
  if (!CLIENT_ID || CLIENT_ID.includes("your_")) {
    return null;
  }

  try {
    const response = await axios.post(`${BASE_URL}/oauth/token`, {
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return accessToken;
  } catch (err) {
    console.error("[EnodeService] Token Error:", err.message);
    return null;
  }
}

/**
 * Get real-time inverter production data
 * @param {number} predictedOutput - Used to generate realistic demo data
 */
async function getInverterData(predictedOutput = 0) {
  const token = await getAccessToken();

  if (!token) {
    // Demo Mode: Generate realistic data within the requested 85-95% efficiency band
    // This prevents the 'down and down' spiral by using a stable baseline
    const baseAccuracy = 0.88; // Target 88% accuracy as requested
    const variance = (Math.random() * 0.08) - 0.04; // +/- 4% flutter
    const actualOutput = Math.max(0, predictedOutput * (baseAccuracy + variance));
    
    return {
      isDemo: true,
      actualOutput: Number(actualOutput.toFixed(2)),
      lastUpdated: new Date().toISOString(),
      status: "CONNECTED",
      efficiency: "88.4%", // Reflecting the 85-90% range
      gridVoltage: "231V",
      inverterTemp: "39°C"
    };
  }

  try {
    // In a real scenario, we'd need a user's device ID. 
    // This is a simplified call to get linked inverters.
    const response = await axios.get(`${BASE_URL}/inverters`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Extract the first inverter's production state
    const inverter = response.data[0];
    if (inverter) {
        return {
            isDemo: false,
            actualOutput: inverter.productionState?.productionRate || 0,
            status: inverter.isReachable ? "ONLINE" : "OFFLINE",
            lastUpdated: new Date().toISOString(),
            deviceId: inverter.id
        };
    }
    
    throw new Error("No inverters found");
  } catch (err) {
    console.error("[EnodeService] API Error:", err.message);
    throw err;
  }
}

module.exports = { getInverterData };
