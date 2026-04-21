/**
 * Weather Service
 * Calls OpenWeatherMap API and extracts relevant fields.
 */

const axios = require("axios");

const CACHE = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 mins cache duration

/**
 * Fetch current weather for a city.
 */
async function fetchWeather(city) {
  const cacheKey = `curr_${city}`;
  if (CACHE[cacheKey] && (Date.now() - CACHE[cacheKey].timestamp < CACHE_TTL)) {
    return CACHE[cacheKey].data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
    console.warn("[WeatherService] OpenWeatherMap API key is missing. Using default values.");
    return {
      city: city,
      temperature: 25,
      clouds: 20,
      humidity: 50,
      description: "partly cloudy",
      icon: "02d"
    };
  }


  try {
    const response = await axios.get(baseUrl, {
      params: { q: city, appid: apiKey, units: "metric" },
      timeout: 5000,
    });

    const data = response.data;
    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      clouds: data.clouds.all,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
    
    // Save to cache
    CACHE[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.warn(`[WeatherService] Current weather failed. Using default values.`);
    return {
      city: city,
      temperature: 25,
      clouds: 20,
      humidity: 50,
      description: "partly cloudy",
      icon: "02d"
    };
  }
}

/**
 * Fetch 5-day forecast and aggregate into daily data.
 * @param {string} city 
 */
async function fetchWeeklyForecast(city) {
  const cacheKey = `week_${city}`;
  if (CACHE[cacheKey] && (Date.now() - CACHE[cacheKey].timestamp < CACHE_TTL)) {
    return CACHE[cacheKey].data;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "") {
    console.warn("[WeatherService] OpenWeatherMap API key is missing. Using fallback schedule.");
    // Fallback/Mock for demo
    const mock = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      mock.push({
        date: d.toISOString().split('T')[0],
        temperature: 22 + Math.random() * 5,
        clouds: Math.floor(Math.random() * 100),
        humidity: 40 + Math.floor(Math.random() * 20),
        description: "partly cloudy (mock)",
        icon: "02d"
      });
    }
    return mock;
  }

  try {
    const response = await axios.get(forecastUrl, {
      params: { q: city, appid: apiKey, units: "metric" },
      timeout: 7000,
    });

    const list = response.data.list;
    const dailyData = {};

    // Aggregate 3-hour chunks into days
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
      if (!dailyData[date]) {
        dailyData[date] = {
          tempSum: 0,
          cloudSum: 0,
          humSum: 0,
          windSum: 0,
          count: 0,
          date: date,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      }
      dailyData[date].tempSum += item.main.temp;
      dailyData[date].cloudSum += item.clouds.all;
      dailyData[date].humSum += item.main.humidity;
      dailyData[date].windSum += item.wind.speed;
      dailyData[date].count += 1;
    });

    // Convert to array and calculate averages
    const result = Object.values(dailyData).map((d) => ({
      date: d.date,
      temperature: Number((d.tempSum / d.count).toFixed(1)),
      clouds: Math.round(d.cloudSum / d.count),
      humidity: Math.round(d.humSum / d.count),
      windSpeed: Number((d.windSum / d.count).toFixed(1)),
      description: d.description,
      icon: d.icon
    })).slice(0, 7); // OWM Free gives ~5 days, we take what we have

    CACHE[cacheKey] = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.warn(`[WeatherService] Forecast failed for ${city}. Using fallback.`);
    // Fallback/Mock for demo if API fails
    const mock = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      mock.push({
        date: d.toISOString().split('T')[0],
        temperature: 22 + Math.random() * 5,
        clouds: Math.floor(Math.random() * 100),
        humidity: 40 + Math.floor(Math.random() * 20),
        description: "partly cloudy",
        icon: "02d"
      });
    }
    return mock;
  }
}

module.exports = { fetchWeather, fetchWeeklyForecast };
