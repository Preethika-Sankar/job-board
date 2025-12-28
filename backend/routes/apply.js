const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL connection
const jwt = require("jsonwebtoken");

// Apply to a job
router.post("/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode token to get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Insert application into DB
    await pool.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2)",
      [userId, jobId]
    );

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Apply error:", err.message);
    res.status(500).json({ error: "Failed to apply" });
  }
});

module.exports = router;