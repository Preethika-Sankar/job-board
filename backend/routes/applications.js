const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Candidate applies to a job
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { job_id, resume_url } = req.body;

  // 🔍 Debug logs
  console.log("Decoded user from token:", req.user);
  console.log("Apply request payload:", { job_id, candidate_id: req.user.id, resume_url });

  try {
    await pool.query(
      'INSERT INTO applications (job_id, candidate_id, resume_url, status) VALUES ($1, $2, $3, $4)',
      [job_id, req.user.id, resume_url || '', 'submitted']
    );
    res.json({ message: 'Application submitted' });
  } catch (e) {
    console.error("🔥 Apply error:", e.message);
    res.status(500).json({ message: e.message });
  }
});

// Candidate views their applications
router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, j.title, j.company, j.location
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.candidate_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("🔥 Candidate applications error:", e.message);
    res.status(500).json({ message: e.message });
  }
});

// Recruiter views applications for their jobs
router.get('/employer', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, u.email AS candidate_email, j.title
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.candidate_id = u.id
       WHERE j.recruiter_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("🔥 Employer applications error:", e.message);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;