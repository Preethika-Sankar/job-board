const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, role]
    );

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("🔥 Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;