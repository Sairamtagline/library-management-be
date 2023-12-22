const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: String,
    author: String,
    currentAvailability: {
      type: Boolean,
      default: true
    },
  },
  {
    collection: "books",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("books", bookSchema);