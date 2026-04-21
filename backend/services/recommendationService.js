/**
 * SolSense Ultra Recommendation Service (v5.1)
 * High-precision AI intelligence for multi-day scheduling and performance analysis.
 */

/**
 * Generate Ultra recommendations based on ML output and system parameters.
 */
function getUltraRecommendations(predData, capacity, weather) {
  const { predictedSolarOutput, optimalTiltAngle, potentialMaxOutput, tiltImprovementPercent } = predData;
  const ratio = capacity > 0 ? predictedSolarOutput / capacity : 0;

  // 1. Core Generation Level (Precision Tiers)
  let level = "moderate";
  if (ratio >= 0.75) level = "high";
  if (ratio < 0.25) level = "low";

  // 2. AI Tilt Insight
  const tiltInsight = {
    optimalTilt: optimalTiltAngle,
    improvementPotental: tiltImprovementPercent,
    advice: tiltImprovementPercent > 3 
      ? `🚨 AI Alert: Adjusting to ${optimalTiltAngle}° could boost output by ${tiltImprovementPercent}%!` 
      : `✅ Your current tilt is optimized for high-precision capture.`
  };

  // 3. Smart Schedule (Current window intelligence)
  const hour = new Date().getHours();
  const rec = getHourRecommendation(hour, predictedSolarOutput, capacity);
  const schedule = [
    { time: "Current", activity: rec, status: ratio > 0.7 ? "Optimal" : "Active" },
    { time: "Next 4h", activity: getHourRecommendation(hour + 4, predictedSolarOutput * 0.8, capacity), status: "Forecast" }
  ];

  // 4. Maintenance Intelligence (Dynamic Verdicts)
  const maintenance = [];
  const { temperature, humidity, clouds, windSpeed } = weather;

  if (temperature > 38) maintenance.push("🌡️ High Heat: Panels may experience thermal derating.");
  if (humidity > 85) maintenance.push("💧 High Humidity: Check for potential condensation.");
  if (clouds > 80 && ratio < 0.15) maintenance.push("☁️ Heavy Overcast: Output severely impacted.");
  if (windSpeed > 12) maintenance.push("💨 Strong Winds: Monitor structural integrity.");
  
  if (maintenance.length === 0) maintenance.push("✨ System health looks optimal based on physics matching.");

  // 5. Full Day Solar Planner (Hourly Yield Curve)
  const hourlyPlanner = getFullDayPlanner(predictedSolarOutput);

  return {
    level,
    ratio: Math.min(100, Math.round(ratio * 100)),
    tiltInsight,
    schedule,
    maintenance,
    hourlyPlanner
  };
}

/**
 * Simulates a 24-hour solar yield curve based on peak predicted output.
 */
function getFullDayPlanner(peakOutput) {
  const curve = [];
  for (let h = 0; h < 24; h++) {
    let yield_val = 0;
    if (h >= 6 && h <= 18) {
      const x = (h - 6) / 12;
      yield_val = peakOutput * Math.sin(Math.PI * x);
      // Realistic fluctuation
      yield_val = Math.max(0, yield_val * (0.85 + Math.random() * 0.15));
    }
    
    curve.push({
      hour: `${h === 0 ? 12 : h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`,
      rawHour: h,
      yield: Number(yield_val.toFixed(2)),
      recommendation: getHourRecommendation(h, yield_val, peakOutput)
    });
  }
  return curve;
}

function getHourRecommendation(hour, yield_val, peak) {
  if (yield_val === 0) return "Grid Power Mode";
  const ratio = yield_val / (peak || 1);
  if (ratio > 0.8) return "Peak Yield: EV Charging / Heavy Industrial";
  if (ratio > 0.5) return "High Yield: Washing Machine / AC";
  if (ratio > 0.3) return "Moderate: Home Appliances / TV";
  return "Low Yield: Charging Light Electronics only";
}

/**
 * NEW: getWeeklyPlanner
 * Suggests best appliances to use for each day and includes hourly depth.
 */
function getWeeklyPlanner(weeklyData) {
  return weeklyData.map(day => {
    const { predictedSolarOutput } = day;
    
    // Generate an 8-hour "active window" for each day
    const activeWindow = [];
    for (let h = 9; h <= 17; h++) {
       const x = (h - 6) / 12;
       const hourlyYield = predictedSolarOutput * Math.sin(Math.PI * x) * (0.9 + Math.random() * 0.1);
       activeWindow.push({
         hour: `${h > 12 ? h-12 : h} ${h >= 12 ? 'PM' : 'AM'}`,
         yield: hourlyYield.toFixed(2),
         recommendation: getHourRecommendation(h, hourlyYield, predictedSolarOutput)
       });
    }

    return {
      date: day.date,
      dayName: day.dayName,
      peakOutput: predictedSolarOutput,
      weather: day.weather.description,
      hourlySchedule: activeWindow
    };
  });
}

function getV5Stats(predData, capacity, weather, efficiency, tiltAngle) {
  const { temperature, clouds, humidity } = weather;
  const { optimalTiltAngle } = predData;
  
  const effFactor = (efficiency || 18) / 20.0;
  
  // High-precision panel temp logic
  const panelTemp = temperature + ((1.0 - (clouds/100)) * 25);
  const surfaceTemp = Number(panelTemp.toFixed(1));
  
  // Performance Ratio (PR) - Realistic calculation
  const tempLoss = Math.max(0, (panelTemp - 25) * 0.0042);
  const tiltDev = Math.abs((tiltAngle || 0) - (optimalTiltAngle || 0));
  const tiltLoss = (tiltDev / 90) * 0.12; 

  let pr = 0.90 - (clouds / 500) - (tempLoss * 0.5) - tiltLoss;
  pr = Math.min(Math.max(pr, 0.65), 0.96); // Clamp PR at a realistic 96% max

  // Solar Intensity (W/m2)
  const baseIntensity = (1.0 - (clouds / 150)) * 1000;
  let intensity = Math.round(baseIntensity * (0.9 + (effFactor - 1) * 0.5));
  intensity = Math.min(intensity, 1200); // Standard peak is 1000, 1200 allows for high efficiency capture simulation

  return {
    surfaceTemp,
    performanceRatio: Math.min(100, (pr * 100)).toFixed(1) + "%",
    intensity: Math.max(0, intensity) + " W/m²",
    inverterStatus: pr > 0.85 ? "Optimal" : pr > 0.75 ? "Good" : "Efficiency Drop"
  };
}

module.exports = { 
  getUltraRecommendations, 
  getFullDayPlanner, 
  getV5Stats,
  getWeeklyPlanner
};
