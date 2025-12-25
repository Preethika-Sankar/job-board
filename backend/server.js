// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
// ✅ PostgreSQL connection for Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});
// ✅ LOGIN ROUTE
app.post('/login', async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ REGISTER ROUTE
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET JOBS
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs");
    res.json(result.rows);
  } catch (err) {
    console.error("Jobs error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ POST A JOB
app.post('/jobs', async (req, res) => {
  try {
    const { title, company, location, description, recruiter_id } = req.body;
    const result = await pool.query(
      "INSERT INTO jobs (title, company, location, description, recruiter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, company, location, description, recruiter_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Post job error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ APPLY TO A JOB
app.post('/applications', async (req, res) => {
  try {
    const { job_id, candidate_id, resume_url } = req.body;
    const result = await pool.query(
      "INSERT INTO applications (job_id, candidate_id, resume_url, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [job_id, candidate_id, resume_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET APPLICATIONS
app.get('/applications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, u.email AS candidate_email, j.title AS job_title, j.company, a.resume_url, a.status
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      JOIN jobs j ON a.job_id = j.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Applications error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));