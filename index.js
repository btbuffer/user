#!/usr/bin/env node

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const routes = require("./routes/index.js");
require("dotenv").config();

// Create an express application
const app = express();
const PORT = process.env.PORT || 8080;

// Treat and parse sent data as application/json
app.use(express.json());
app.use(cookieParser());
app.use(routes);

async function init() {
  // For testing locally
  app.listen(PORT, () => console.log(`App listens on port ${PORT}`));
  await mongoose.connect(process.env.DBPOINTER);
}

init()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error: ", err.message));
