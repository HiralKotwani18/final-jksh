const Borrow = require("../../models/borrow.model");
const Book = require("../../models/book.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const sendEmail = require("../../utils/email");
const paypalClient = require("../../config/paypalConfig");

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
    book.issuedBy.push({
      userId: userId,
    });
    await book.save();
    await borrow.save();

    const user = await User.findById(userId);
    sendEmail(
      user.email,
      "Book Borrowed",
      `You have borrowed ${book.title}. Please return it by ${dueDate}.`
    );

    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    // const { returnedDate } = req.body;
    const returnedDate = Date.now();

    const borrow = await Borrow.findById(id).populate("book");
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    borrow.returnedDate = returnedDate;
    const dueDate = new Date(borrow.dueDate);
    const returned = new Date(returnedDate);

    if (returned > dueDate) {
      const lateDays = Math.ceil((returned - dueDate) / (1000 * 60 * 60 * 24));
      borrow.lateFee = lateDays * 10; // Example: ₹10 per day
    }

    borrow.book.quantity += 1;
    borrow.book.returnedBy.push({
      userId: userId,
      returnDate: Date.now(),
    });
    await borrow.book.save();
    await borrow.save();

    // Send notification email
    const user = await User.findById(borrow.user);

    if (borrow.lateFee > 0) {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "INR",
              value: borrow.lateFee.toFixed(2),
            },
            description: `Late fee for borrow ID: ${borrow._id}`,
          },
        ],
      });

      const order = await paypalClient.client.execute(request);
      const paymentLink = `https://www.sandbox.paypal.com/checkoutnow?token=${order.result.id}`;

      sendEmail(
        user.email,
        "Late Fee Payment",
        `You have returned ${borrow.book.title} late. Please pay the late fee of $${borrow.lateFee} using the following link: ${paymentLink}`
      );
    } else {
      sendEmail(
        user.email,
        "Book Returned",
        `You have returned ${borrow.book.title}. Thank you!`
      );
    }

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

exports.createPayment = async (req, res) => {
  const { borrowId, lateFee } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "INR",
          value: lateFee.toFixed(2),
        },
        description: `Late fee for borrow ID: ${borrowId}`,
      },
    ],
  });

  try {
    const order = await paypalClient.client.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.capturePayment = async (req, res) => {
  const { orderId } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.client.execute(request);
    res.json(capture.result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
