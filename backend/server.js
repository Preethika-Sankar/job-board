const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // needed for Render/Postgres
  },
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err.message));

// Routes
const authRoutes = require("./routes/auth");   // registration + login
const jobRoutes = require("./routes/jobs");   // job apply route

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Job Board API is running ✅");
});

app.use("/", authRoutes);
app.use("/", jobRoutes);

// Health check route
app.get("/ping", (req, res) => {
  res.json({ message: "Server is alive 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;