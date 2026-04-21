/**
 * SolSense — Express Backend Server
 * ===================================
 * Entry point for the Node.js REST API.
 * - Weather data from OpenWeatherMap
 * - Solar prediction via Python ML service
 * - Solar profile CRUD (PostgreSQL)
 * - JWT Auth
 *
 * Run:  node server.js
 * Port: 5000 (configurable via .env)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const weatherRoutes = require("./routes/weatherRoutes");
const predictRoutes = require("./routes/predictRoutes");
const solarProfileRoutes = require("./routes/solarProfileRoutes");
const authRoutes = require("./routes/authRoutes");
const enodeRoutes = require("./routes/enodeRoutes");
const { initDatabase } = require("./services/solarProfileService");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(cors());
app.use(express.json());

// Request logger (simple)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/weather", weatherRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/solar-profile", solarProfileRoutes);
app.use("/api", authRoutes);
app.use("/api/enode", enodeRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "solsense-backend" });
});

// Root route redirect/help
app.get("/", (_req, res) => {
  res.send(`
    <h1>SolSense Backend is running!</h1>
    <p>The API is accessible at <code>/api</code>.</p>
    <p>To view the dashboard, visit the frontend at: <a href="http://localhost:5173">http://localhost:5173</a></p>
  `);
});

// ---------------------------------------------------------------------------
// Initialise DB & Start
// ---------------------------------------------------------------------------

async function startServer() {
  try {
    await initDatabase();
    const server = app.listen(PORT, () => {
      console.log(`[SolSense Backend] Running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('[Server Instance Error]:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

startServer();
