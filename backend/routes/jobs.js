const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Apply for a job
router.post("/apply/:id", authenticateToken, async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;

  try {
    // Check if job exists
    const job = await pool.query("SELECT * FROM jobs WHERE id = $1", [jobId]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Insert application
    await pool.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2)",
      [userId, jobId]
    );

    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("🔥 Apply error:", err.message);
    res.status(500).json({ error: "Failed to apply" });
  }
});

module.exports = router;