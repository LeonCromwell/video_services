const express = require("express");
const dotenv = require("dotenv");

const route = require("./src/routes");
const connect = require("./src/config/db");
const { configureBucketCors } = require("./src/config/google");

dotenv.config();

configureBucketCors().catch(console.error);
connect();
const app = express();
const port = process.env.PORT || 3000;

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
