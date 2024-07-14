var express = require("express");
var router = express.Router();
const authCtrl = require("../../controllers/auth.controller");
// const publicAuthentication = require("../../middleware/publicAuthentication");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
// router.get("/google", authCtrl.google);

module.exports = router;
