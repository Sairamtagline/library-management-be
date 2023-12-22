const mongoose = require("mongoose");
const { USER_TYPE } = require("../config/config");

const usersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: [USER_TYPE.USER, USER_TYPE.ADMIN],
    },
    password: {
      type: String,
      default: null,
    },
    contact: {
      type: Number,
      required: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("users", usersSchema);
