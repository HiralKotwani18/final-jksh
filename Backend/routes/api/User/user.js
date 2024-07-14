var express = require("express");
var router = express.Router();
const bookRoutes = require("./book");

router.use("/book", bookRoutes);

module.exports = router;