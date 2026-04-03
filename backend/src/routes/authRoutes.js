const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Phone is required"),
  city: z.string().min(2, "City is required"),
  platform: z.string().min(2, "Platform is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingWorker = await prisma.worker.findUnique({
      where: { email: parsed.email }
    });

    if (existingWorker) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const worker = await prisma.worker.create({
      data: {
        ...parsed,
        password: hashedPassword
      }
    });

    await prisma.alert.createMany({
      data: [
        {
          workerId: worker.id,
          title: "Welcome to GigShield AI",
          description: "Your worker protection account is active now.",
          severity: "info"
        },
        {
          workerId: worker.id,
          title: "Heavy rain advisory",
          description: "Weather risk is elevated this week in your registered zone.",
          severity: "warning"
        }
      ]
    });

    await prisma.claim.createMany({
      data: [
        {
          workerId: worker.id,
          disruptionType: "Heavy Rain",
          zone: "Kurla East Hex",
          amount: 420,
          status: "APPROVED"
        },
        {
          workerId: worker.id,
          disruptionType: "AQI Spike",
          zone: "Andheri West Hex",
          amount: 260,
          status: "PENDING"
        }
      ]
    });

    const token = jwt.sign(
      {
        id: worker.id,
        email: worker.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      worker: {
        id: worker.id,
        fullName: worker.fullName,
        email: worker.email,
        city: worker.city,
        platform: worker.platform,
        weeklyPremium: worker.weeklyPremium,
        coveragePlan: worker.coveragePlan
      }
    });
  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    });

    const parsed = loginSchema.parse(req.body);

    const worker = await prisma.worker.findUnique({
      where: { email: parsed.email }
    });

    if (!worker) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(parsed.password, worker.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: worker.id,
        email: worker.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      worker: {
        id: worker.id,
        fullName: worker.fullName,
        email: worker.email,
        city: worker.city,
        platform: worker.platform,
        weeklyPremium: worker.weeklyPremium,
        coveragePlan: worker.coveragePlan
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Login failed" });
  }
});

module.exports = router;