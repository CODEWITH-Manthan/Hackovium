-- SolSense Database Schema
-- Run these queries in pgAdmin4 on the 'solsense' database

-- =====================================================
-- 1. CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. CREATE SOLAR_PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS solar_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_name VARCHAR(255) NOT NULL,
  panel_capacity DECIMAL(10, 2) NOT NULL,
  panel_efficiency DECIMAL(5, 2) DEFAULT 18,
  tilt_angle DECIMAL(5, 2) DEFAULT 30,
  location_city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. CREATE PREDICTIONS TABLE (Optional - for analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES solar_profiles(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2),
  clouds INTEGER,
  humidity DECIMAL(5, 2),
  predicted_output DECIMAL(10, 2),
  optimal_tilt INTEGER,
  potential_max_output DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_solar_profiles_user_id ON solar_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_profile_id ON predictions(profile_id);

-- =====================================================
-- DONE! All tables created successfully
-- =====================================================
