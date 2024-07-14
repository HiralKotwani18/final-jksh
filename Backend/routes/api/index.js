var express = require("express");
var router = express.Router();

const authRoutes = require("./auth");

// Public Routes
router.use("/auth", authRoutes);

module.exports = router;