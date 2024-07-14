const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date },
  lateFee: { type: Number, default: 0 },
});

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
