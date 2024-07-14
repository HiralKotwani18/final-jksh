const Borrow = require("../models/borrow");
const Book = require("../models/book");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.borrowBook = async (req, res) => {
  const { bookId, dueDate } = req.body;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    const borrow = new Borrow({
      user: userId,
      book: bookId,
      dueDate,
    });

    book.quantity -= 1;
    await book.save();
    await borrow.save();

    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  const { id } = req.params;
  const { returnedDate } = req.body;

  try {
    const borrow = await Borrow.findById(id).populate("book");
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    borrow.returnedDate = returnedDate;
    const dueDate = new Date(borrow.dueDate);
    const returned = new Date(returnedDate);

    if (returned > dueDate) {
      const lateDays = Math.ceil((returned - dueDate) / (1000 * 60 * 60 * 24));
      borrow.lateFee = lateDays * 1; // Example: $1 per day
    }

    borrow.book.quantity += 1;
    await borrow.book.save();
    await borrow.save();

    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBorrowHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const borrowHistory = await Borrow.find({ user: userId }).populate("book");
    res.json(borrowHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await Borrow.find().populate("book user");
    res.json(borrowRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
