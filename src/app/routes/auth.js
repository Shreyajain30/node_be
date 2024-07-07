const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const router = express.Router();
const secretKey="1952859eea72437a83421640a55ec69cab1b8b04f72e9ad91de61a77c8dfdf66";
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
  const { email, password, role } = req.body;
  const users = readUsers();
  const existingUser = users.find(
    (user) => user.email === email && user.role === role
  );

  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ email, password, role });
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully!" });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const users = readUsers();
  const user = users.find(
    (user) =>
      (user.email === email && user.password === password && user.role === role)
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials!" });
  }
  const token=jwt.sign({email:email,role:role},secretKey,{ expiresIn: "6h" });
  res.status(200).json({ message: "Login successful!" ,token});
});

module.exports = {router,secretKey};
