const express = require('express');
const app = express();

// ✅ Confirm route is registered
app.get('/ping', (req, res) => {
  res.json({ message: "Server is alive!" });
});

// ✅ Start server
app.listen(5050, () => {
  console.log("Test server running on port 5050");
});