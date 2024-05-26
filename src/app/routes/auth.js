const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const usersFilePath = path.join(__dirname, "../../data/users.json");

// Helper function to read users
const readUsers = () => {
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write users
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Register route
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  const users = readUsers();
  const existingUser = users.find(
    (user) => user.username === username && user.role === role
  );

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password, role });
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Login successful", role: user.role });
});

module.exports = router;
