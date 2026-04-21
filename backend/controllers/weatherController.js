/**
 * Weather Controller
 * Handles GET /api/weather?city=<city>
 */

const weatherService = require("../services/weatherService");

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "Query parameter 'city' is required." });
    }

    const weatherData = await weatherService.fetchWeather(city);
    return res.json(weatherData);
  } catch (err) {
    console.error("[WeatherController] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
