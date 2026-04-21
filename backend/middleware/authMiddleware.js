/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user info to request
 */

const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided. Use: Authorization: Bearer <token>" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Token verification error:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired. Please login again." });
    }
    
    return res.status(401).json({ error: "Invalid or malformed token." });
  }
}

module.exports = { authenticate };
