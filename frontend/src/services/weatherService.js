/**
 * Weather Service (Frontend)
 */
import api from "./api";

export const getWeather = async (city) => {
  const response = await api.get(`/weather?city=${city}`);
  return response.data;
};

export const listCities = async () => {
  const response = await api.get("/predict/cities");
  return response.data;
};
