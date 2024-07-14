var express = require("express");
var router = express.Router();

const adminCtrl = require("../../../controllers/Admin/admin.controller");
const bookRoutes = require("./book");
// const borrowRoutes = require("./borrow");

router.get("/me", adminCtrl.me);
router.get("/user", adminCtrl.findAll);
router.use("/book", bookRoutes);

module.exports = router;