const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  isbn: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;