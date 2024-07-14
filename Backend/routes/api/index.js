var express = require("express");
var router = express.Router();
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

const authRoutes = require("./auth");
const constants = require("../../utils/constants");
const adminRoutes = require("./Admin/admin");

// Public Routes
router.use("/auth", authRoutes);

// Middleware to check token
router.use(authentication.protect);

// Admin Routes
router.use("/admin", authorization([constants.roles.admin]), adminRoutes);

module.exports = router;
