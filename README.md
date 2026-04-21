# SolSense Ultra Amber ☀️ (v5 Stable)

**High-Fidelity Solar Intelligence** — A state-of-the-art web application that predicts solar energy generation using a high-sensitivity Gradient Boosting ML model, live meteorological data, and physics-based orbital mechanics for tilt optimization.

---

## 📋 Features (v5 Alpha Update)

- **Precision ML (v5)** — Upgraded to `GradientBoostingRegressor` for ultra-accurate, linear scaling with Panel Capacity and Efficiency.
- **Dynamic Technical Cards** — Real-time tracking of **Solar Intensity (W/m²)**, **Panel Surface Temperature (°C)**, and **Performance Ratio (PR)**.
- **AI Tilt Optimizer** — Recommends the mathematically optimal angle for your panels based on latitude and sun position.
- **Weather Resilience** — Robust fallback system for local microclimates and API interruptions.
- **Glassmorphism UI** — Premium "Amber Glow" theme with high-density data visualizations and micro-animations.
- **Full Day Planner** — 24-hour predictive generation curve with appliance scheduling advice.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, Vite, Vanilla CSS (Amber Glow System), Axios, Recharts |
| **Backend** | Node.js, Express, File-based JSON Database (Profiles), JWT Auth |
| **A.I. Engine** | Python 3.10, Scikit-learn (Gradient Boosting), Flask API |
| **Meteorology** | OpenWeatherMap API |

---

## 🚀 Setup & Run (From Clone)

Follow these steps exactly to get SolSense running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [Git](https://git-scm.com/)

---

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/your-repo/SolSense.git
cd SolSense
```

#### A. Backend & Frontend
```bash
# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

#### B. ML Service
```bash
cd ../ml-model
pip install -r requirements.txt
```

---

### Step 2: Configure Environment

1. Navigate to the `backend/` directory.
2. Create or edit a `.env` file and add your **OpenWeatherMap API Key**:
```env
OPENWEATHER_API_KEY=your_actual_api_key_here
PORT=5000
ML_SERVICE_URL=http://localhost:5001
```

---

### Step 3: Run the Application

You need to have **three terminals** open to run all services simultaneously.

#### Terminal 1: ML Prediction Service
```bash
cd ml-model
# First time only: Train the model
python train_model.py
# Start the service
python model.py
```
*Runs on http://localhost:5001*

#### Terminal 2: Node.js Backend
```bash
cd backend
npm run dev
```
*Runs on http://localhost:5000*

#### Terminal 3: React Frontend
```bash
cd frontend
npm run dev
```
*Runs on http://localhost:5173*

---

## 📂 Project Structure

```
SolSense/
├── frontend/               # React Application (Ultra Amber UI)
├── backend/                # Node.js Orchestration Layer
│   ├── controllers/        # Logical Handlers (Predict/Profiles)
│   ├── services/           # Services (Weather, AI Orchestration)
│   └── data/               # Persistent Storage (profiles.json)
├── ml-model/               # Python A.I. Core
│   ├── train_model.py      # GradientBoosting Training
│   └── model.py            # Flash API for Predictions
└── README.md               # You are here
```

---

## ⚖️ License & Credits

**Copyright © 2026 Team FaloodaCoders**
Licensed under MIT. Powered by Advanced Solar AI.
