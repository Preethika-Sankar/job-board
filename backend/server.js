require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db"); // PostgreSQL connection

const app = express();
app.use(cors());
app.use(express.json());

// ======================= REGISTER =======================
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, role",
      [email, hashedPassword, role]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ role: user.role, token });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ======================= LOGIN =======================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ role: user.role, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ======================= JOBS =======================
app.get("/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Jobs error:", err.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/jobs", async (req, res) => {
  const { title, company, location, salary, tags, description } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, company, location, salary, tags, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, company, location, salary, tags, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Post job error:", err.message);
    res.status(500).json({ error: "Failed to post job" });
  }
});

// ======================= APPLY =======================
app.post("/apply/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await pool.query(
      "INSERT INTO applications (user_id, job_id) VALUES ($1, $2)",
      [userId, jobId]
    );

    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Apply error:", err.message);
    res.status(500).json({ error: "Failed to apply" });
  }
});

// ======================= SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));