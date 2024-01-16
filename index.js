const express = require("express");
const dotenv = require("dotenv");

const route = require("./src/routes");
const connect = require("./src/config/db");

dotenv.config();
connect();
const app = express();
const port = process.env.PORT || 3000;

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
