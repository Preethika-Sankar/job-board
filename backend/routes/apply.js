const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// Middleware to decode token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded must contain id
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Apply route
router.post("/apply/:jobId", authenticate, async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user.userId;

  console.log("🧠 Applying with userId:", userId, "jobId:", jobId);

  try {
    await pool.query(
      "INSERT INTO applications (job_id, user_id) VALUES ($1, $2)",
      [jobId, userId]
    );
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("🔥 Apply error:", err.message);
    res.status(500).json({ error: "Error applying for job" });
  }
});