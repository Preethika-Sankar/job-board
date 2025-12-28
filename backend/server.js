const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db"); // PostgreSQL connection
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // <-- critical for reading JSON body

// Routes
app.use("/", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Start server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});