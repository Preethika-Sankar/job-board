const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Forbidden' });
  const { job_id, resume_url } = req.body;
  try {
    await pool.query(
      'INSERT INTO applications (job_id,candidate_id,resume_url,status) VALUES (?,?,?,?)',
      [job_id, req.user.id, resume_url || '', 'submitted']
    );
    res.json({ message: 'Application submitted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Forbidden' });
  const [rows] = await pool.query(
    `SELECT a.*, j.title, j.company, j.location
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.candidate_id=?`, [req.user.id]
  );
  res.json(rows);
});

router.get('/employer', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const [rows] = await pool.query(
    `SELECT a.*, u.name AS candidate_name, j.title
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN users u ON a.candidate_id = u.id
     WHERE j.posted_by=?`, [req.user.id]
  );
  res.json(rows);
});

module.exports = router;