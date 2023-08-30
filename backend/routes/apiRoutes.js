const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

const app = express();

const jwt = require("jsonwebtoken");

app.get("/logout", (req, res) => {
  return res.clearCookie("access_token").send("access token cleared");
});

app.get("/get-token", (req, res) => {
  try{
    const accessToken = req.cookies["access_token"];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    return res.json({
      token: decoded.name,
      isAdmin: decoded.isAdmin
    });
  }catch(error){
    return res.status(401).send("Unauthorized. Invalid token");
  }
});

app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

module.exports = app;