const videoRouter = require("./video");

module.exports = function (app) {
  app.use("/", videoRouter);
};
