const calculateRisk = (weather) => {
  if (!weather) return "LOW";

  let score = 0;

  const temp = weather.main?.temp || 0;
  const humidity = weather.main?.humidity || 0;
  const wind = weather.wind?.speed || 0;
  const condition = weather.weather?.[0]?.main?.toLowerCase() || "";

  // 🌧 Rain logic (intensity-based if available)
  if (condition.includes("rain")) {
    const rainVolume = weather.rain?.["1h"] || 0;

    if (rainVolume > 10) score += 50;       // heavy rain
    else if (rainVolume > 3) score += 30;   // moderate rain
    else score += 20;                       // light rain
  }

  // 🌩 Thunderstorm (very high risk)
  if (condition.includes("thunderstorm")) {
    score += 60;
  }

  // 🌫 Haze / fog (low impact)
  if (condition.includes("haze") || condition.includes("fog") || condition.includes("mist")) {
    score += 10;
  }

  // 🔥 Temperature logic (realistic thresholds)
  if (temp > 45) score += 50;         // extreme heat (danger)
  else if (temp > 40) score += 30;    // high heat
  else if (temp < 10) score += 20;    // cold risk (optional)

  // 💨 Wind logic
  if (wind > 15) score += 40;         // dangerous
  else if (wind > 10) score += 25;    // strong
  else if (wind > 6) score += 10;     // noticeable

  // 💧 Humidity (minor factor)
  if (humidity > 90) score += 10;

  // 🎯 Final classification
  if (score >= 70) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
};

module.exports = { calculateRisk };