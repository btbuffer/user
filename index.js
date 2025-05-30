const express = require("express");
const router = require("./routes/user.routes");

// Create an express application
const app = express();

// Treat and parse sent data as application/json
app.use(express.json());
app.use(router);

const port = 8080;
app.listen(port, () => console.log(`App listens on port ${port}`));
