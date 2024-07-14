const Book = require("../../models/book.model");
const axios = require("axios");
const environment = require("../../utils/environment");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/response");

exports.addBook = async (req, res) => {
  const { isbn } = req.body;

  try {
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return sendErrorResponse(res, { message: "Book already exists" }, 400);
    }

    const response = await axios.get(
      `${environment.googleApi}/volumes?q=isbn:${isbn}`
    );
    const bookData = response.data.items[0].volumeInfo;

    const book = new Book({
      isbn,
      title: bookData.title,
      author: bookData.authors[0],
      publisher: bookData.publisher,
      year: bookData.publishedDate.split("-")[0],
      genre: bookData.categories[0],
      quantity: req.body.quantity,
    });

    await book.save();
    sendSuccessResponse(res, { data: book }, 201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, publisher, year, genre, quantity } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.publisher = publisher || book.publisher;
    book.year = year || book.year;
    book.genre = genre || book.genre;
    book.quantity = quantity || book.quantity;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchBookDetailsByGoogleAPI = async (req, res) => {
  try {
    const bookName = req.body.bookName;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyB63A2FH8rbqFATVz8tfoqSGNxzRlmFV9k`
    );

    const allBooks = [];
    if (
      response.data &&
      response.data.items &&
      response.data.items.length > 0
    ) {
      for (let i = 0; i < response.data.items.length; i++) {
        const bookData = await response.data.items[i].volumeInfo;
        const isbnNumber =await bookData.industryIdentifiers.map((i)=>{
          if(i.type === "ISBN_13")
          {
            return i.identifier
          }
        }).filter((i)=>{
          return i!=null;
        });
                
        allBooks.push({
          ISBN: isbnNumber[0],
          title: bookData.title,
          author: bookData.authors ? bookData.authors.join(", ") : "Unknown",
          publisher: bookData.publisher || "Unknown",
          year: bookData.publishedDate
            ? new Date(bookData.publishedDate).getFullYear()
            : "Unknown",
          genre: bookData.categories
            ? bookData.categories.join(", ")
            : "Unknown",
          description: bookData.description,
          language: bookData.language,
          infoLink: bookData.infoLink,
          previewLink: bookData.previewLink
        });
      }
      // sendSuccessResponse(res, { data: response.data.items });
      sendSuccessResponse(res, { data: allBooks });
    } else {
      throw new Error("Book not found on Google Books API");
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
