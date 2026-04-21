/**
 * Auth Controller
 * POST /api/register  — register a new user
 * POST /api/login     — login & return token
 */

const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[AuthController] Registration attempt for: ${username}`);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const result = await authService.register(username, password);
    return res.status(201).json(result);
  } catch (err) {
    console.error("[AuthController] Error:", err.message);
    const status = err.message.includes("already exists") ? 409 : 500;
    return res.status(status).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[AuthController] Login attempt for: ${username}`);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const result = await authService.login(username, password);
    return res.json(result);
  } catch (err) {
    console.error("[AuthController] Error:", err.message);
    const status = err.message.includes("Invalid") ? 401 : 500;
    return res.status(status).json({ error: err.message });
  }
};
