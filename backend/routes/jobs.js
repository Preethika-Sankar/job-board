const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const { title, company, location, salary, tags, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO jobs (title,company,location,salary,tags,description,posted_by) VALUES (?,?,?,?,?,?,?)',
      [title, company, location, salary || null, tags || '', description, req.user.id]
    );
    res.json({ message: 'Job posted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  const { q, location, tag } = req.query;
  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];
  if (q) { sql += ' AND title LIKE ?'; params.push(`%${q}%`); }
  if (location) { sql += ' AND location LIKE ?'; params.push(`%${location}%`); }
  if (tag) { sql += ' AND tags LIKE ?'; params.push(`%${tag}%`); }
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/by/me', auth, async (req, res) => {
  if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
  const [rows] = await pool.query('SELECT * FROM jobs WHERE posted_by=?', [req.user.id]);
  res.json(rows);
});

module.exports = router;