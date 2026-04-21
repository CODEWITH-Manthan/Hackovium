"""
SolSense Ultra — ML Prediction API (v3)
========================================
Flask server that loads the trained SolSense Ultra model.
Includes AI Tilt Optimizer.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from datetime import datetime

MODEL_PATH = os.path.join(os.path.dirname(__file__), "solar_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("Ultra Model file not found. Run 'python train_model.py' first.")

model = joblib.load(MODEL_PATH)
print(f"[INFO] Ultra Model loaded from {MODEL_PATH}")

app = Flask(__name__)
CORS(app)

def get_day_of_year():
    return datetime.now().timetuple().tm_yday

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    required = ["temperature", "clouds", "humidity", "panelCapacity", "latitude"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    # Extract inputs
    temp = float(data["temperature"])
    clouds = float(data["clouds"])
    humidity = float(data["humidity"])
    capacity = float(data["panelCapacity"])
    lat = float(data["latitude"])
    eff = float(data.get("panelEfficiency", 18))
    day = int(data.get("dayOfYear", get_day_of_year()))
    
    # User-provided tilt or default to latitude
    current_tilt = float(data.get("tiltAngle", lat))

    # --- 1. Predict for current configuration ---
    features = np.array([[temp, clouds, humidity, capacity, eff, lat, current_tilt, day]])
    raw_pred = model.predict(features)[0]
    prediction = round(max(float(raw_pred[0]), 0), 2)
    ai_predicted_tilt = round(float(raw_pred[1]), 1)

    # --- 2. AI Tilt Optimizer (High Precision Sweep) ---
    tilts = np.linspace(0, 70, 71) # Range 0-70 is standard for solar
    fixed_features = np.array([temp, clouds, humidity, capacity, eff, lat, 0, day])
    test_features = np.tile(fixed_features, (len(tilts), 1))
    test_features[:, 6] = tilts 
    
    tilt_results = model.predict(test_features)
    # Extract prediction scores
    scores = tilt_results[:, 0]
    
    # Add a stability bias: slight preference for angles closer to latitude
    stability_factor = 0.001 # 0.1% per degree of misalignment
    biases = 1.0 - (np.abs(tilts - lat) / 90.0) * stability_factor
    biased_scores = scores * biases

    best_tilt_idx = np.argmax(biased_scores)
    
    optimal_tilt = int(tilts[best_tilt_idx])
    max_output = round(max(float(scores[best_tilt_idx]), 0), 2)

    return jsonify({
        "predictedSolarOutput": prediction,
        "optimalTiltAngle": optimal_tilt,
        "aiOptimalTilt": ai_predicted_tilt, # Bonus regression output
        "potentialMaxOutput": max_output,
        "tiltImprovementPercent": round(((max_output - prediction) / prediction * 100), 1) if prediction > 0 else 0
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "Ultra v3", "model": "loaded"})

if __name__ == "__main__":
    print("[INFO] Starting SolSense Ultra prediction server on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
