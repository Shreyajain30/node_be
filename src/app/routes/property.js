const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { secretKey } = require("./auth");
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
  console.log("in authenticateUser")
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const bearerToken = token.split(" ")[1];
  jwt.verify(bearerToken, secretKey, (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = data;

    next();
  });
};

// Middleware to check if user is a seller
const authenticateSeller = (req, res, next) => {
  authenticateUser(req, res, () => {
  console.log("in authenticateSeller")

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  });
};
// Middleware to check if user is a buyer
const authenticateBuyer = (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  });
};
// Create property
router.post("/seller/:email", authenticateSeller, (req, res) => {
  const requestedUser = req.params.email;
  const loggedInUser = req.user.email;
  if (requestedUser !== loggedInUser)
    return res.status(403).send({ message: "forbidden" });
  const properties = readProperties();
  const property = {
    id: properties[properties.length - 1].id + 1,
    ...req.body,
    sellerId: req.params.email,
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
  console.log("came in update");
  const properties = readProperties();
  const propertyIndex = properties.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );

  if (propertyIndex === -1) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (properties[propertyIndex].sellerId !== req.user.email) {
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

  if (properties[propertyIndex].sellerId !== req.user.email) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const deletedProperty = properties.splice(propertyIndex, 1);
  writeProperties(properties);
  res
    .status(200)
    .json({ message: "Property deleted", property: deletedProperty[0] });
});

// List properties for buyer
router.get("/buyer", authenticateBuyer, (req, res) => {
  const properties = readProperties();
  res.status(200).json(properties);
});

// Show details of seller
router.get("/seller/:email", authenticateUser, (req, res) => {
  const requestedUser = req.params.email;
  const loggedInUser = req.user.email;
  if (requestedUser !== loggedInUser)
    return res.status(403).send({ message: "forbidden" });
  const users = readUsers();
  const seller = users.find(
    (user) => user.email === req.params.email && user.role === "seller"
  );

  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  const properties = readProperties().filter(
    (property) => property.sellerId === seller.email
  );
  res.status(200).json(properties);
});

module.exports = router;
