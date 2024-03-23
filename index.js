const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const route = require("./src/routes");
const connect = require("./src/config/db");
const { configureBucketCors } = require("./src/config/google");
const queueWoker = require("./src/utils/Queue/queueWoker");

dotenv.config();

configureBucketCors().catch(console.error);
connect();

queueWoker();
const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
