const { response, serverError } = require("../helpers/common");
const userModel = require("../models/userModel");
const transactionModel = require("../models/transactions");
const { default: mongoose } = require("mongoose");

exports.getTransactions = async (req, res) => {
  try {
    const { _id, role } = req?.user;
    const query = {};
    if (role === "USER") {
      query.userId = new mongoose.Types.ObjectId(_id);
    }

    const transactions = await transactionModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: {
          path: "$book",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          _id: 1,
          dueDate: 1,
          transactionType: 1,
          createdAt: 1,
          user: {
            _id: 1,
            userName: 1,
            name: 1,
            email: 1,
            role: 1,
          },
          book: {
            _id: 1,
            name: 1,
            author: 1,
          },
        },
      },
    ]);

    return response(
      res,
      false,
      200,
      "Get transaction successfully!",
      transactions
    );
  } catch (error) {
    console.log("error =====getTransactions=====:>> ", error);
    return serverError(res, error);
  }
};
