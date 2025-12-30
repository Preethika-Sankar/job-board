const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Route
router.post("/apply/:jobId", authenticate, async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user.userId;

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

module.exports = router;