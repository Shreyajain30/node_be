const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./app/routes/auth");
const userRoutes = require("./app/routes/user");

const app = express();
app.use(bodyParser.json());

app.use("/", (req, res) => {
  return res.send("hello world");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
