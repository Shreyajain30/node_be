const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const usersFilePath = path.join(__dirname, "../../data/users.json");
const propertiesFilePath = path.join(__dirname, "../../data/properties.json");

// Helper functions to read and write data
const readUsers = () => JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
const readProperties = () =>
  JSON.parse(fs.readFileSync(propertiesFilePath, "utf8"));
const writeProperties = (properties) =>
  fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 2));

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const { username, password } = req.headers;
  const users = readUsers();
  const user = users.find((user) => {
    return user.username === username;
  });

  console.log(user);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};

// Middleware to check if user is a seller
const authenticateSeller = (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  });
};

// Create property
router.post("/", authenticateSeller, (req, res) => {
  const properties = readProperties();
  const property = {
    id: properties.length + 1,
    ...req.body,
    seller: req.user.username,
    likes: [],
  };
  properties.push(property);
  writeProperties(properties);
  res.status(201).json({ message: "Property created", property });
});

// Read properties
router.get("/", (req, res) => {
  const properties = readProperties();
  res.status(200).json(properties);
});

// Update property
router.put("/:id", authenticateSeller, (req, res) => {
  const properties = readProperties();
  const propertyIndex = properties.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );

  if (propertyIndex === -1) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (properties[propertyIndex].seller !== req.user.username) {
    return res.status(403).json({ message: "Forbidden" });
  }

  properties[propertyIndex] = { ...properties[propertyIndex], ...req.body };
  writeProperties(properties);
  res
    .status(200)
    .json({ message: "Property updated", property: properties[propertyIndex] });
});

// Delete property
router.delete("/:id", authenticateSeller, (req, res) => {
  const properties = readProperties();
  const propertyIndex = properties.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );

  if (propertyIndex === -1) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (properties[propertyIndex].seller !== req.user.username) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const deletedProperty = properties.splice(propertyIndex, 1);
  writeProperties(properties);
  res
    .status(200)
    .json({ message: "Property deleted", property: deletedProperty[0] });
});

// Like property
router.post("/:id/like", authenticateUser, (req, res) => {
  const properties = readProperties();
  const property = properties.find((p) => p.id === parseInt(req.params.id));

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (!property.likes.includes(req.user.username)) {
    property.likes.push(req.user.username);
    writeProperties(properties);
  }

  res.status(200).json({ message: "Property liked", property });
});

// List properties for buyer
router.get("/buyer", authenticateUser, (req, res) => {
  const properties = readProperties();
  res.status(200).json(properties);
});

// Show details of seller
router.get("/seller/:username", authenticateUser, (req, res) => {
  const users = readUsers();
  const seller = users.find(
    (user) => user.username === req.params.username && user.role === "seller"
  );

  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const properties = readProperties().filter(
    (property) => property.seller === seller.username
  );
  res.status(200).json({ seller, properties });
});

module.exports = router;
