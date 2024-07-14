const Book = require("../../models/book.model");
const axios = require("axios");
const environment = require("../../utils/environment");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../utils/response");
const historyModel = require("../../models/history.model");

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
      libraryQuantity: req.body.quantity,
    });

    await book.save();
    const history = await historyModel.findOneAndUpdate(
      {
        librarianId: req.user._id,
        bookId: book._id
      },
      {
        $push: {
          activityType: {
            activityName: `Book Added by librarian ${req.user.fullName}`,
            activityTime: new Date(),
            doneBy: req.user._id,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    sendSuccessResponse(res, { data: {book: book, history: history} }, 201);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    let columns = Object.keys(req.body);
    let columnNames = columns.map((val) => {
      return { [val]: req.body[val] };
    });
    const mergedObject = columnNames.reduce((result, currentObject) => {
      return { ...result, ...currentObject };
    }, {});

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        ...mergedObject,
      },
      {
        new: true,
      }
    );

    sendSuccessResponse(res, { data: updatedBook });
  } catch {
    sendErrorResponse(res, error.message);
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    sendSuccessResponse(res, { message: "Book Removed successfully" });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    sendSuccessResponse(res, { data: book });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const books = await Book.find({
      $or: [
        { title: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
        { genre: new RegExp(search, "i") },
        { publisher: new RegExp(search, "i") },
      ],
    });

    if (books.length == 0) {
      console.log("hii");
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}&key=AIzaSyB63A2FH8rbqFATVz8tfoqSGNxzRlmFV9k`
      );
      console.log(response);

      const getBookFromGoogleApis = [];
      if (
        response.data &&
        response.data.items &&
        response.data.items.length > 0
      ) {
        for (let i = 0; i < response.data.items.length; i++) {
          const bookData = await response.data.items[i].volumeInfo;
          const isbnNumber = await bookData.industryIdentifiers
            .map((i) => {
              if (i.type === "ISBN_13") {
                return i.identifier;
              }
            })
            .filter((i) => {
              return i != null;
            });

          getBookFromGoogleApis.push({
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
            previewLink: bookData.previewLink,
            message: "Book is not in the stock",
          });
        }
        // sendSuccessResponse(res, { data: response.data.items });
        return sendSuccessResponse(res, { data: getBookFromGoogleApis });
      } else {
        throw new Error("Book not found");
      }
    } else {
      sendSuccessResponse(res, { data: books });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
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
        const isbnNumber = await bookData.industryIdentifiers
          .map((i) => {
            if (i.type === "ISBN_13") {
              return i.identifier;
            }
          })
          .filter((i) => {
            return i != null;
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
          previewLink: bookData.previewLink,
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
