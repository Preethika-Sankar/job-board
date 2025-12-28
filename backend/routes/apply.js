const express = require("express");
const router = express.Router();
const pool = require("../db");

// Apply to a job
router.post("/:jobId", async (req, res) => {
  const { userId } = req.body;
  const { jobId } = req.params;

  try {
    await pool.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2)",
      [userId, jobId]
    );
    res.json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply error:", err.message);
    res.status(500).json({ error: "Failed to apply" });
  }
});

module.exports = router;