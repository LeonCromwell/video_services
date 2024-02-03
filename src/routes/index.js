const videoRouter = require("./video");
const kue = require("kue");

module.exports = function (app) {
  app.use("/", videoRouter);
  app.use("/kue-api", kue.app);
};
