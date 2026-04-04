const cron = require("node-cron");
const prisma = require("../lib/prisma");
const { getWeatherData } = require("../services/weatherService");
const { calculateRisk } = require("../utils/riskEngine");

const generateAlerts = async () => {
  try {
    const workers = await prisma.worker.findMany();

    for (const worker of workers) {
      const weather = await getWeatherData(worker.city);
      if (!weather) continue;

      const condition = weather.weather[0].main.toLowerCase();
      const description = weather.weather[0].description;
      const wind = weather.wind.speed;
      const temp = weather.main.temp;
      const humidity = weather.main.humidity;

      const risk = calculateRisk(weather);

      const alertsToCreate = [];

      // 🌧 Rain logic (better)
      if (condition.includes("rain")) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "Rain Disruption",
          description: `${description} in ${worker.city}. Roads may slow down deliveries.`,
          severity: risk === "HIGH" ? "high" : "medium"
        });
      }

      // 🌬 Wind logic
      if (wind > 12) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "High Wind Risk",
          description: `Wind speed ${wind} m/s in ${worker.city}. Riding may be unsafe.`,
          severity: "medium"
        });
      }

      // 🔥 Extreme heat logic (FIXED thresholds)
      if (temp > 45) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "Severe Heat Risk",
          description: `Extreme temperature ${temp}°C in ${worker.city}. Unsafe for long rides.`,
          severity: "high"
        });
      } else if (temp > 40) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "High Temperature",
          description: `Temperature ${temp}°C in ${worker.city}. Stay hydrated.`,
          severity: "medium"
        });
      }

      // 🌫 Haze/Fog (low severity)
      if (condition.includes("haze") || condition.includes("fog")) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "Low Visibility",
          description: `${description} in ${worker.city}. Visibility reduced.`,
          severity: "low"
        });
      }

      // 💧 High humidity (optional minor alert)
      if (humidity > 85) {
        alertsToCreate.push({
          workerId: worker.id,
          title: "High Humidity",
          description: `Humidity ${humidity}% in ${worker.city}. Can affect comfort.`,
          severity: "low"
        });
      }

      // 🚫 Prevent duplicate alerts (last 10 mins)
      for (const alert of alertsToCreate) {
        const existing = await prisma.alert.findFirst({
          where: {
            workerId: worker.id,
            title: alert.title,
            createdAt: {
              gte: new Date(Date.now() - 10 * 60 * 1000) // last 10 min
            }
          }
        });

        if (!existing) {
  await prisma.alert.create({
    data: {
      ...alert
    }
  });
}
      }
    }

    console.log("✅ Real alerts generated (deduplicated)");
  } catch (err) {
    console.error("❌ Alert generation error:", err.message);
  }
};

// every 2 minutes
cron.schedule("*/2 * * * *", generateAlerts);