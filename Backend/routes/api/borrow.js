const express = require("express");
const authCtrl = require("./../../controllers/borrow.controller");
const { protect, librarian } = require("./../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, authCtrl.borrowBook);
router.put("/:id/return", protect, authCtrl.returnBook);
router.get("/history", protect, authCtrl.getUserBorrowHistory);
router.get("/", protect, librarian, authCtrl.getAllBorrowRecords);

module.exports = router;
