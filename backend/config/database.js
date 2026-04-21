/**
 * PostgreSQL Database Connection Pool
 * Handles all database connections for SolSense
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log connection errors
pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error] Unexpected error on idle client:', err);
  process.exit(-1);
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('[PostgreSQL] Connection Error:', err.stack);
  } else {
    console.log('[PostgreSQL] ✓ Connected successfully to database');
    release();
  }
});

module.exports = pool;
