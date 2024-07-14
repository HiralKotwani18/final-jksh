const express = require("express");
const {
  borrowBook,
  returnBook,
  getUserBorrowHistory,
  getAllBorrowRecords,
} = require("../../../controllers/Admin/borrow.controller");
const { protect, librarian } = require("../../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, borrowBook);
router.put("/:id/return", protect, returnBook);
router.get("/history", protect, getUserBorrowHistory);
router.get("/", protect, librarian, getAllBorrowRecords);

module.exports = router;
