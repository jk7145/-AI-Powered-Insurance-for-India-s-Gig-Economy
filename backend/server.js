const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./src/routes/authRoutes");
const workerRoutes = require("./src/routes/workerRoutes");

dotenv.config();

const app = express();

/**
 * ✅ CORS (safe for dev + avoids 403 issues)
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);

/**
 * ✅ Middleware
 */
app.use(express.json());

/**
 * ✅ Request Logger (VERY useful for debugging)
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * ✅ Root Route
 */
app.get("/", (req, res) => {
  res.send("🚀 GigShield AI Backend is running");
});

/**
 * ✅ Health Check
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "GigShield AI backend running"
  });
});

require("./src/jobs/alertJob");  
require("./src/jobs/claimJob"); 

/**
 * ✅ API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/worker", workerRoutes);

/**
 * ✅ 404 Handler (for unknown routes)
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/**
 * ✅ Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/**
 * ✅ Start Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});