const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Preethika@2005',
  database: process.env.DB_NAME || 'job_board'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ Register
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('❌ Registration error:', err);
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// ✅ Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: results[0] });
  });
});

// ✅ Post Job
app.post('/jobs', (req, res) => {
  const { title, company, location, salary, tags, description, posted_by } = req.body;

  if (!title || !company || !location || !salary || !tags || !description || !posted_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO jobs (title, company, location, salary, tags, description, posted_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(sql, [title, company, location, salary, tags, description, posted_by], (err, result) => {
    if (err) {
      console.error('❌ Job posting error:', err);
      return res.status(500).json({ error: 'Failed to post job' });
    }
    res.status(201).json({ message: 'Job posted successfully' });
  });
});

// ✅ Get all jobs
app.get('/jobs', (req, res) => {
  db.query('SELECT * FROM jobs ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('❌ Fetch jobs error:', err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
    res.json(results);
  });
});

// ✅ Get jobs by user
app.get('/my-jobs/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT * FROM jobs WHERE posted_by = ?', [userId], (err, results) => {
    if (err) {
      console.error('❌ Fetch my jobs error:', err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
    res.json(results);
  });
});

// ✅ Apply for a job
app.post('/applications', (req, res) => {
  const { job_id, candidate_id, resume_url, status } = req.body;

  if (!job_id || !candidate_id) {
    return res.status(400).json({ error: 'job_id and candidate_id are required' });
  }

  const sql = `
    INSERT INTO applications (job_id, candidate_id, resume_url, status, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [job_id, candidate_id, resume_url || '', status || 'submitted'], (err, result) => {
    if (err) {
      console.error('❌ Application error:', err);
      return res.status(500).json({ error: 'Failed to apply' });
    }
    res.status(201).json({ message: 'Application submitted successfully', appId: result.insertId });
  });
});

// ✅ View applications for a job
app.get('/applications/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = `
    SELECT a.id, a.resume_url, a.status, a.created_at,
           u.name AS candidate_name, u.email AS candidate_email
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = ?
    ORDER BY a.created_at DESC
  `;
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error('❌ Fetch applications error:', err);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
    res.json(results);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});