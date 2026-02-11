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
    req.user = user; // contains id, role, email
    next();
  });
}

// ✅ Get all jobs (open to everyone)
router.get("/", async (req, res) => {
  try {
    const jobs = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(jobs.rows);
  } catch (err) {
    console.error("🔥 Jobs fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ✅ Recruiter posts a new job
router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ error: "Only recruiters can post jobs" });
  }

  const { title, description, company, location } = req.body;
  try {
    const newJob = await pool.query(
      "INSERT INTO jobs (title, description, company, location, recruiter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, company, location, req.user.id]
    );
    res.json(newJob.rows[0]);
  } catch (err) {
    console.error("🔥 Job post error:", err.message);
    res.status(500).json({ error: "Failed to create job" });
  }
});

module.exports = router;