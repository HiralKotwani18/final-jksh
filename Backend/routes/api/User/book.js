const express = require("express");
const {
  borrowBook,
  returnBook,
  getUserBorrowHistory,
  getAllBorrowRecords,
  createPayment,
  capturePayment,
} = require("../../../controllers/Admin/borrow.controller");
const { protect, librarian } = require("../../../middleware/authentication");
const router = express.Router();

router.post("/borrowbook", protect, borrowBook);
router.put("/:id/returnbook", protect, returnBook);
router.get("/history", protect, librarian, getUserBorrowHistory);
router.get("/allborrowrecords", protect, librarian, getAllBorrowRecords);
router.post("/payment", protect, createPayment);
router.post("/capture-payment", protect, capturePayment);

module.exports = router;
