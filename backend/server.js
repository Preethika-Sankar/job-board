const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // required by Render
});

db.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Database connection failed:', err));

// ✅ Register
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)';
    await db.query(sql, [name, email, password, role]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const results = await db.query(sql, [email, password]);

    if (results.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: results.rows[0] });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Post Job
app.post('/jobs', async (req, res) => {
  const { title, company, location, salary, tags, description, posted_by } = req.body;

  if (!title || !company || !location || !salary || !tags || !description || !posted_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const sql = `
      INSERT INTO jobs (title, company, location, salary, tags, description, posted_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `;
    await db.query(sql, [title, company, location, salary, tags, description, posted_by]);
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (err) {
    console.error('❌ Job posting error:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// ✅ Get all jobs
app.get('/jobs', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(results.rows);
  } catch (err) {
    console.error('❌ Fetch jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// ✅ Get jobs by user
app.get('/my-jobs/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const results = await db.query('SELECT * FROM jobs WHERE posted_by = $1', [userId]);
    res.json(results.rows);
  } catch (err) {
    console.error('❌ Fetch my jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// ✅ Apply for a job
app.post('/applications', async (req, res) => {
  const { job_id, candidate_id, resume_url, status } = req.body;

  if (!job_id || !candidate_id) {
    return res.status(400).json({ error: 'job_id and candidate_id are required' });
  }

  try {
    const sql = `
      INSERT INTO applications (job_id, candidate_id, resume_url, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    const result = await db.query(sql, [job_id, candidate_id, resume_url || '', status || 'submitted']);
    res.status(201).json({ message: 'Application submitted successfully', appId: result.insertId });
  } catch (err) {
    console.error('❌ Application error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

// ✅ View applications for a job
app.get('/applications/:jobId', async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const sql = `
      SELECT a.id, a.resume_url, a.status, a.created_at,
             u.name AS candidate_name, u.email AS candidate_email
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.created_at DESC
    `;
    const results = await db.query(sql, [jobId]);
    res.json(results.rows);
  } catch (err) {
    console.error('❌ Fetch applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Job Board Backend is running on Render with PostgreSQL');
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});