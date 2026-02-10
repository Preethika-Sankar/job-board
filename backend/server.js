const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");
const applyRoute = require("./routes/apply");
const applicationsRoute = require("./routes/applications");

app.use("/api/auth", authRoute);
app.use("/jobs", jobsRoute);
app.use("/apply", applyRoute);
app.use("/applications", applicationsRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Job Board backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
