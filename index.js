// index.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve your HTML file

// POST route to save permit data
app.post("/save", (req, res) => {
  const { permitNumber, issuedDate, permitHolder } = req.body;

  if (!permitNumber || !issuedDate || !permitHolder) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  const newData = {
    id: Date.now(),
    permitNumber,
    issuedDate,
    permitHolder,
    timestamp: new Date().toISOString()
  };

  // Read current file content
  let existingData = [];
  if (fs.existsSync("data.json")) {
    const file = fs.readFileSync("data.json");
    existingData = JSON.parse(file);
  }

  // Add new record
  existingData.push(newData);

  // Save back to file
  fs.writeFileSync("data.json", JSON.stringify(existingData, null, 2));

  res.json({ message: "Permit data recorded successfully!" });
});

// Route to view all records (optional)
app.get("/records", (req, res) => {
  const file = fs.readFileSync("data.json");
  const data = JSON.parse(file);
  res.json(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
