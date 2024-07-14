const express = require("express");
const {
  borrowBook,
  returnBook,
  getUserBorrowHistory,
  getAllBorrowRecords,
} = require("../../../controllers/Admin/borrow.controller");
const { protect, librarian } = require("../../../middleware/authentication");
const router = express.Router();

router.post("/borrowbook", protect, borrowBook);
router.put("/:id/returnbook", protect, returnBook);
router.get("/history", protect, librarian, getUserBorrowHistory);
router.get("/allborrowrecords", protect, librarian, getAllBorrowRecords);

module.exports = router;
