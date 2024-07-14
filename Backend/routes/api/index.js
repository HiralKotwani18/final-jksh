var express = require("express");
var router = express.Router();
const authentication = require("../../middleware/authMiddleware");
const authorization = require("../../middleware/authorization");

const authRoutes = require("./auth");
const constants = require("../../utils/constants");
const adminRoutes = require("./Admin/admin");
// const borrowRoutes = require("./borrow");

// Public Routes
router.use("/auth", authRoutes);

// Middleware to check token
// router.use(authentication);

// Admin Routes
router.use("/admin", authorization([constants.roles.admin]), adminRoutes);

// router.use("/book", bookRoutes);
// router.use("/borrow", borrowRoutes);

module.exports = router;
