const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const workerRoutes = require("./src/routes/workerRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "GigShield AI backend running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/worker", workerRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});