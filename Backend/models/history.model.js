const mongoose = require("mongoose");
const { librarian } = require("../middleware/authentication");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    activityName: {
      type: String,
    },
    activityTime: {
      type: Date,
    },
    reason: {
      type: String,
    },
    doneBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, _id: false }
);

const history = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    librarianId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    borrowId: {
      type: Schema.Types.ObjectId,
      ref: "Borrow",
    },
    activityType: [
      {
        type: activitySchema,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const historyModel = mongoose.model("History", history);

module.exports = historyModel;
