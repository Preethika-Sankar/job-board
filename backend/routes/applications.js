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

// ✅ Candidate applies for a job
router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ error: "Only candidates can apply" });
  }

  const { jobId, resumeUrl } = req.body;

  try {
    // Insert application
    const newApp = await pool.query(
      `INSERT INTO applications (job_id, candidate_id, resume_url, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, job_id, candidate_id, status, applied_at`,
      [jobId, req.user.id, resumeUrl, "Pending"]
    );

    // Fetch job details
    const job = await pool.query(
      "SELECT title, company, location FROM jobs WHERE id = $1",
      [jobId]
    );

    if (job.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Merge application + job details
    const response = {
      ...newApp.rows[0],
      ...job.rows[0],
    };

    res.json(response);
  } catch (err) {
    console.error("🔥 Application error:", err.message);
    res.status(500).json({ error: "Failed to apply" });
  }
});

// ✅ Candidate fetches their own applications
router.get("/me", authenticateToken, async (req, res) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ error: "Only candidates can view their applications" });
  }

  try {
    const result = await pool.query(
      `SELECT a.id, a.status, a.applied_at, j.title, j.company, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.candidate_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 Fetch applications error:", err.message);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ✅ Recruiter fetches all applications
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ error: "Only recruiters can view applications" });
  }

  try {
    const result = await pool.query(
      `SELECT a.id, a.status, a.applied_at, a.candidate_id, j.title, j.company, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.applied_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 Fetch all applications error:", err.message);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// ✅ Recruiter updates application status
router.put("/:id/status", authenticateToken, async (req, res) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ error: "Only recruiters can update status" });
  }

  const { status } = req.body; // "Selected", "Rejected", "Pending"
  try {
    const updated = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error("🔥 Status update error:", err.message);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;