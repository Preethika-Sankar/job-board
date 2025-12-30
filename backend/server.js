const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

// Routes
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Required to parse JSON body

// Route mounting
app.use("/", authRoutes);         // /login
app.use("/", registerRoutes);     // /register
app.use("/jobs", jobRoutes);      // /jobs
app.use("/applications", applicationRoutes); // /applications

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Start server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});