const { response, serverError } = require("../helpers/common");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const transactionModel = require("../models/transactions");
const { default: mongoose } = require("mongoose");

exports.createBook = async (req, res) => {
  try {
    const { name, author } = req?.body;
    const findBook = await bookModel.findOne({ name });

    // if (findBook) {
    //   return response(res, true, 400, "Book name already exists!!");
    // }

    const book = await bookModel.create({ name, author });
    return response(res, false, 201, "Book created succesfully!", book);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { name, author } = req?.body;
    const { bookId } = req?.params;
    const findBook = await bookModel.findOne({ name });

    // if (findBook) {
    //   return response(res, true, 400, "Book name already exists!!");
    // }

    const book = await bookModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(bookId) },
      { name, author },
      { new: true }
    );
    return response(res, false, 201, "Book updated succesfully!", book);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req?.params;
    if (!bookId) {
      return response(res, true, 400, "Book not found!");
    }

    const findBook = await bookModel.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
    });

    if (!findBook) {
      return response(res, true, 400, "Please enter a valid bookId!");
    }

    if (findBook.currentAvailability === false) {
      return response(res, false, 400, "Can not delete issued book!");
    }
    await transactionModel.deleteMany({ bookId });
    const book = await bookModel.deleteOne({
      _id: new mongoose.Types.ObjectId(bookId),
    });

    return response(res, false, 200, "Book deleted succesfully!", book);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { role } = req?.user;
    const query = {};

    // if (role === "USER") {
    //   query.currentAvailability = true;
    // }
    const books = await bookModel.find(query).sort({ createdAt: -1 }).lean();
    return response(res, false, 200, "Get books succesfully!", books);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId } = req?.params;
    const { userId, dueDate } = req?.body;

    const book = await bookModel.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
      currentAvailability: true,
    });

    if (!book) {
      return response(res, true, 400, "No book found!");
    }

    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return response(res, true, 400, "No user found!");
    }

    const issueBook = await bookModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(bookId) },
      { currentAvailability: false },
      { new: true }
    );

    const transaction = await transactionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      bookId,
      dueDate,
      transactionType: "borrowed",
    });

    console.log("transaction =====:>> ", transaction);
    return response(res, false, 200, "book issued succesfully!", issueBook);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req?.params;

    const book = await bookModel.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
    });

    if (!book) {
      return response(res, true, 400, "No book found!");
    }

    const borrowedTransaction = await transactionModel.findOne({
      bookId: new mongoose.Types.ObjectId(bookId),
      transactionType: "borrowed",
    });

    if (!borrowedTransaction) {
      return response(res, true, 400, "Please borrowe book first!");
    }

    const returnBook = await bookModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(bookId) },
      { currentAvailability: true },
      { new: true }
    );

    const transaction = await transactionModel.create({
      userId: borrowedTransaction?.userId,
      bookId,
      dueDate: null,
      transactionType: "returned",
    });
    console.log("transaction =====:>> ", transaction);
    return response(res, false, 200, "book returned succesfully!", returnBook);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.dailyBookList = async (req, res) => {
  try {
    const startDate = new Date(new Date());
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(new Date());
    endDate.setHours(23, 59, 59, 999);

    const [todaysIssued, todaysDue, totalIssued, dueMissed] = await Promise.all(
      [
        transactionModel
          .find({
            transactionType: "borrowed",
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          })
          .countDocuments(),
        transactionModel
          .find({
            transactionType: "borrowed",
            dueDate: {
              $gte: startDate,
              $lte: endDate,
            },
          })
          .countDocuments(),
        transactionModel
          .find({
            transactionType: "borrowed",
          })
          .countDocuments(),
        transactionModel
          .find({
            transactionType: "borrowed",
            dueDate: {
              $lte: startDate,
            },
          })
          .countDocuments(),
      ]
    );

    return response(res, false, 200, "Books count list get succesfully!", {
      todaysIssued,
      todaysDue,
      totalIssued,
      dueMissed,
    });
  } catch (error) {
    return serverError(res, error);
  }
};
