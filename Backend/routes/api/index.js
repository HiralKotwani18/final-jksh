var express = require("express");
var router = express.Router();
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

const authRoutes = require("./auth");
const constants = require("../../utils/constants");
const adminRoutes = require("./Admin/admin");
const userRoutes = require("./User/user");

// Public Routes
router.use("/auth", authRoutes);

// Middleware to check token
router.use(authentication.protect);

// Admin Routes
router.use("/admin", authorization([constants.roles.admin, constants.roles.librarian]), adminRoutes);

router.use("/user", authorization([constants.roles.user]), userRoutes);

module.exports = router;
