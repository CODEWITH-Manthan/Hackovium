/**
 * Auth Service v2 (PostgreSQL)
 * User authentication with PostgreSQL database and JWT tokens.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password
 * @returns {Object} — { message, username, id }
 */
async function register(username, password) {
  try {
    // Check for duplicate username
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("User already exists.");
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Insert new user into database
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, hash]
    );

    const user = result.rows[0];
    return {
      message: "User registered successfully.",
      username: user.username,
      id: user.id,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Login an existing user.
 * @param {string} username
 * @param {string} password
 * @returns {Object} — { message, username, token, id }
 */
async function login(username, password) {
  try {
    // Get user from database
    const result = await pool.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid username or password.");
    }

    const user = result.rows[0];

    // Verify password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      throw new Error("Invalid username or password.");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      message: "Login successful.",
      username: user.username,
      token,
      id: user.id,
    };
  } catch (err) {
    throw err;
  }
}

module.exports = { register, login };
