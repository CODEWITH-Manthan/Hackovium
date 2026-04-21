/**
 * Prediction Service (Frontend)
 */
import api from "./api";

/**
 * Get solar prediction based on live weather (via city) or explicit params.
 * @param {Object} params — { city, panelCapacity, panelEfficiency, tiltAngle }
 */
export const getPrediction = async (params) => {
  const response = await api.post("/predict", params);
  return response.data;
};
