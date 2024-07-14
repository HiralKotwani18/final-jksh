const express = require("express");
const {
  addBook,
  updateBook,
  deleteBook,
  getBook,
  searchBooks,
} = require("./../../controllers/book.controller");
const { protect, librarian } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, librarian, addBook);
router.put("/:id", protect, librarian, updateBook);
router.delete("/:id", protect, librarian, deleteBook);
router.get("/:id", protect, getBook);
router.get("/", protect, searchBooks);

module.exports = router;
