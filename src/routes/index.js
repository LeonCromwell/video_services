const uploadRouter = require("./upload");

module.exports = function (app) {
  app.use("/upload", uploadRouter);
};
