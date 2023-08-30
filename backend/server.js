require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require('express');
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const apiRoutes = require('./routes/apiRoutes');

const app = express();

const httpServer = createServer(app);
global.io = new Server(httpServer);

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

app.get('/', async (req, res, next) => {
  res.json({ message: "API running..." });
});

const connectDB = require("./config/db");
connectDB();

app.use('/api', apiRoutes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack
    });
  }
  else{
    res.status(500).json({
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });