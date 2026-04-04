const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const { getWeatherData } = require("../services/weatherService");
utils = require("../utils/riskEngine");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        city: true,
        platform: true,
        weeklyPremium: true,
        coveragePlan: true,
        createdAt: true
      }
    });

    return res.json(worker);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch worker" });
  }
});

router.get("/claims", authMiddleware, async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      where: { workerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json(claims);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch claims" });
  }
});

router.get("/alerts", authMiddleware, async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { workerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json(alerts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

router.patch("/plan", authMiddleware, async (req, res) => {
  try {
    const { coveragePlan, weeklyPremium } = req.body;

    const updatedWorker = await prisma.worker.update({
      where: { id: req.user.id },
      data: {
        coveragePlan,
        weeklyPremium
      }
    });

    return res.json(updatedWorker);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update plan" });
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const workerId = req.user.id;

    const worker = await prisma.worker.findUnique({
      where: { id: workerId }
    });

    const claims = await prisma.claim.findMany({
      where: { workerId }
    });

    const alerts = await prisma.alert.findMany({
      where: { workerId }
    });

    // 🔥 ADD WEATHER HERE
    const weather = await getWeatherData(worker.city);

    const formattedWeather = weather
      ? {
          temperature: weather.main.temp,
          condition: weather.weather[0].main,
          windSpeed: weather.wind.speed,
          humidity: weather.main.humidity
        }
      : null;

    const approved = claims.filter(c => c.status === "APPROVED");

    const totalPayout = approved.reduce((sum, c) => sum + c.amount, 0);

    const riskScore =
      alerts.length > 5 ? "HIGH" :
      alerts.length > 2 ? "MEDIUM" :
      "LOW";

    res.json({
      worker: {
        ...worker,
        weather: formattedWeather   // ✅ THIS FIXES YOUR UI
      },
      stats: {
        totalClaims: claims.length,
        totalPayout,
        riskScore,
        alertsCount: alerts.length
      }
    });

  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ message: "Dashboard failed" });
  }
});

router.get("/premium/recommendation", authMiddleware, async (req, res) => {
  const worker = await prisma.worker.findUnique({
    where: { id: req.user.id }
  });

  const claims = await prisma.claim.findMany({
    where: { workerId: worker.id }
  });

  let risk = claims.length;

  let plan = "BASIC";
  let premium = 99;

  if (risk > 5) {
    plan = "PREMIUM";
    premium = 229;
  } else if (risk > 2) {
    plan = "STANDARD";
    premium = 149;
  }

  res.json({ plan, premium });
});


router.get("/city-insights", authMiddleware, async (req, res) => {
  const worker = await prisma.worker.findUnique({
    where: { id: req.user.id }
  });

  const weather = await getWeatherData(worker.city);

  if (!weather) {
    return res.status(500).json({ message: "Weather fetch failed" });
  }

  res.json({
    city: worker.city,
    temperature: weather.main.temp,
    condition: weather.weather[0].main,
    windSpeed: weather.wind.speed,
    humidity: weather.main.humidity
  });
});

module.exports = router;