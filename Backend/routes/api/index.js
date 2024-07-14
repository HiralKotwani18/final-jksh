var express = require("express");
var router = express.Router();

const authRoutes = require("./auth");
const bookRoutes = require("./book");
const borrowRoutes = require("./borrow");

// Public Routes
router.use("/auth", authRoutes);
router.use("/book", bookRoutes);
router.use("/borrow", borrowRoutes);

module.exports = router;
