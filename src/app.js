const express = require("express");
const bodyParser = require("body-parser"); 
const cors = require("cors"); // Import the CORS middleware
const app = express();
require("dotenv").config(); // Fix for loading environment variables

// Import routes
const {router} = require("./app/routes/auth");
const userRoutes = require("./app/routes/user");
const propertyRoutes = require("./app/routes/property");

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// API Routes
app.use("/api/auth", router);
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
