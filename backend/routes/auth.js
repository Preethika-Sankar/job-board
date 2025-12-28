const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // adjust path if needed

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔍 Incoming login request");
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    console.log("User from DB:", user);

    if (!user) {
      console.log("❌ No user found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Login successful");
    res.json({ role: user.role, token });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;