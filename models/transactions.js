const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types?.ObjectId,
      default: "",
    },
    bookId: {
      type: mongoose.Types?.ObjectId,
      default: "",
    },
    dueDate: Date,
    transactionType: { type: String, enum: ["borrowed", "returned"] },
  },
  {
    collection: "transaction",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("transaction", transactionSchema);
