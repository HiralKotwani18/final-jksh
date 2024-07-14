const express = require("express");
const authCtrl = require("./../../controllers/book.controller");
const { protect, librarian } = require("./../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, librarian, authCtrl.addBook);
router.put("/:id", protect, librarian, authCtrl.updateBook);
router.delete("/:id", protect, librarian, authCtrl.deleteBook);
router.get("/:id", protect, authCtrl.getBook);
router.get("/", protect, authCtrl.searchBooks);

module.exports = router;
