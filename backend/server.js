const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render sets this automatically
  ssl: {
    rejectUnauthorized: false
  }
});

// ---------------- USERS ----------------
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------- JOBS ----------------
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/jobs', async (req, res) => {
  const { title, company, location, salary, tags, description, posted_by } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (title, company, location, salary, tags, description, posted_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, company, location, salary, tags, description, posted_by]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------- APPLICATIONS ----------------
app.get('/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/applications', async (req, res) => {
  const { job_id, candidate_id, resume_url, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO applications (job_id, candidate_id, resume_url, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [job_id, candidate_id, resume_url, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});