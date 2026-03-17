const { getApp } = require("../App");

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = await getApp();
  }
  app.server.emit("request", req, res);
};
