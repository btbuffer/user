#!/usr/bin/env node

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/user.routes");
require("dotenv").config();

// Create an express application
const app = express();
const port = 8080;

// Treat and parse sent data as application/json
app.use(express.json());
app.use(router);

async function init() {
  app.listen(port, () => console.log(`App listens on port ${port}`));
  await mongoose.connect(process.env.DBPOINTER);
}

init().catch((err) => console.log("Error: ", err.message));
