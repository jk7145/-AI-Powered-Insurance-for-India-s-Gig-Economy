const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;