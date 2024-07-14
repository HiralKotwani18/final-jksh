const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  getBook,
  searchBooks,
  fetchBookDetailsByGoogleAPI
} = require("../../../controllers/Admin/book.controller");

const { protect, librarian } = require("../../../middleware/authentication");
const router = express.Router();

router.post('/getbookdetailsfromapi', protect, librarian, fetchBookDetailsByGoogleAPI)
router.post("/addbook", protect, librarian, addBook);
router.put("/:id", protect, librarian, updateBook);
router.delete("/:id", protect, librarian, deleteBook);
router.get("/:id", protect, getBook);
router.get("/", protect, searchBooks);

module.exports = router;
