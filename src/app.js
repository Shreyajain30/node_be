const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS middleware
require("dotenv").config(); // Fix for loading environment variables

// Import routes
const authRoutes = require("./app/routes/auth");
const userRoutes = require("./app/routes/user");
const propertyRoutes = require("./app/routes/property");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);

// Default route
app.use("/", (req, res) => {
  res.send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
