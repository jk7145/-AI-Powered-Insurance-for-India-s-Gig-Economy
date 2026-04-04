const axios = require("axios");

const getWeatherData = async (city) => {
  try {
    const res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    console.error("Weather error:", err.response?.data || err.message);
    return null;
  }
};

module.exports = { getWeatherData };