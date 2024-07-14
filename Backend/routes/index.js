var express = require("express");
var router = express.Router();
const apiRoutes = require("./api");
const environment = require("../utils/environment");

router.get("/ping", function (req, res) {
  res.send("pong");
});

router.use("/api", apiRoutes);

module.exports = router;
