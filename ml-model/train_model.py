"""
SolSense Ultra — ML Model Training Script (v3)
==============================================
Advanced solar Intelligence training script.
Includes latitude, tilt angle, and seasonal solar altitude variations.

Features: 
- temperature (°C)
- cloud_coverage (%)
- humidity (%)
- panel_capacity (kW)
- panel_efficiency (%)
- latitude (degrees)
- tilt_angle (degrees)
- day_of_year (1-365)

Target: 
- solar_output (kW)

This model allows for finding the optimal tilt angle by iterating through angles 
and finding the one that yields the highest predicted output.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

# Ultra v5 Physics Parameters
NUM_SAMPLES = 30000 # Optimized for high-precision speed
MODEL_PATH = "solar_model.pkl"

def generate_synthetic_data():
    print(f"Generating {NUM_SAMPLES} samples for SolSense Ultra v5 physics...")
    
    # Core Features
    temp = np.random.uniform(10, 45, NUM_SAMPLES)
    clouds = np.random.uniform(0, 100, NUM_SAMPLES)
    humidity = np.random.uniform(30, 95, NUM_SAMPLES)
    
    # System Features (Strictly linear scaling ranges)
    # Capacity up to 1000kW (Commercial scale)
    panel_capacity = np.random.uniform(1, 1000, NUM_SAMPLES)
    # Efficiency 10% to 40% (Next-gen tandem cells)
    panel_efficiency = np.random.uniform(10, 40, NUM_SAMPLES)
    
    latitude = np.random.uniform(8, 37, NUM_SAMPLES) # India range
    tilt_angle = np.random.uniform(0, 50, NUM_SAMPLES)
    day_of_year = np.random.randint(1, 366, NUM_SAMPLES)

    # V5.2 Enhanced Physics Model (Orbital Mechanics)
    # ---------------------------
    # Declination: Sun's position relative to the equator (+23.45 Summer, -23.45 Winter)
    declination = 23.45 * np.sin(np.radians(360/365 * (284 + day_of_year)))
    
    # Efficiency is now a factor in heat dispersion/loss sensitivity, 
    # but not a primary linear scaler since capacity is already STC rated.
    # eff_factor = panel_efficiency / 20.0 
    
    # Atmospheric losses: Non-linear cloud impact
    # Heavy clouds (80%+) kill output exponentially but NOT to zero
    # Even at 100% clouds, we still have ~15-20% diffuse irradiance
    cloud_loss = np.where(clouds > 70, 0.6 + (clouds - 70) * 0.003, (clouds / 100) * 0.6)
    cloud_loss = np.clip(cloud_loss, 0, 0.8) # Cap losses at 80% to allow for diffuse light
    
    humidity_loss = (humidity / 100) * 0.1
    
    # Thermal Loss Logic: Precise NOCT approximation
    panel_heating = (1.0 - cloud_loss) * 20 
    panel_temp = temp + panel_heating
    panel_temp_loss = np.maximum(0, (panel_temp - 25) * 0.004)
    
    # Angle Factor: Lambert's Cosine Law for direct beam
    # Perpendicular incidence is at tilt_angle = latitude - declination
    # However, in Winter (negative dec), we want higher tilt (Lat - (-23) = Lat + 23)
    # In Summer (positive dec), we want lower tilt (Lat - 23)
    angle_diff = np.abs(latitude - declination - tilt_angle)
    angle_factor = np.cos(np.radians(angle_diff))
    
    # Add diffuse light component (Omnidirectional)
    # Diffuse light doesn't care about tilt as much, but we model it as atmospheric baseline
    angle_factor = (angle_factor * 0.82) + 0.18 # 18% isotropic baseline
    
    # Performance Ratio (System losses: cables, inverter, dirt)
    performance_ratio = np.random.uniform(0.85, 0.95, NUM_SAMPLES)

    # Irradiance varies by ~10% based on earth's eccentricity, but we model seasonal scaling
    seasonal_factor = 1.0 + 0.05 * np.cos(np.radians(360/365 * (day_of_year - 172)))

    # Core Output Formula (kW-Power)
    solar_output = (
        panel_capacity 
        * (1.0 - cloud_loss) 
        * (1.0 - humidity_loss) 
        * (1.0 - panel_temp_loss) 
        * angle_factor 
        * seasonal_factor
        * performance_ratio
        * np.random.uniform(0.99, 1.01, NUM_SAMPLES) # 1% noise
    )
    solar_output = np.maximum(0.1, solar_output)

    # Target 2: Optimal Tilt (Geographic + Seasonality)
    # The perfect tilt to be normal to the sun at solar noon
    optimal_tilt = latitude - declination
    optimal_tilt = np.clip(optimal_tilt, 0, 70) # Hardware limit 70°

    data = {
        "temperature": temp,
        "clouds": clouds,
        "humidity": humidity,
        "panelCapacity": panel_capacity,
        "panelEfficiency": panel_efficiency,
        "latitude": latitude,
        "tiltAngle": tilt_angle,
        "dayOfYear": day_of_year,
        "solarOutput": solar_output,
        "optimalTilt": optimal_tilt
    }
    
    return pd.DataFrame(data)

def train_model():
    df = generate_synthetic_data()
    
    X = df[["temperature", "clouds", "humidity", "panelCapacity", "panelEfficiency", "latitude", "tiltAngle", "dayOfYear"]]
    y = df[["solarOutput", "optimalTilt"]]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    
    # Gradient Boosting for higher precision on linear ranges and fewer plateaus
    print("Training SolSense Ultra v5 Multi-Output Gradient Boosting Regressor...")
    from sklearn.multioutput import MultiOutputRegressor
    
    model = MultiOutputRegressor(GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.1,
        max_depth=6,
        random_state=42
    ))
    
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Model V5 R2 Score: {score:.5f}")
    
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
