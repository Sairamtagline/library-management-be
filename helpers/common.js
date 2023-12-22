const bcrypt = require("bcrypt");

exports.serverError = (res, error) => {
  console.log("Server Error :>> ", error);
  return this.response(res, true, 500, "something-went-wrong");
};

exports.response = (res, isError, statusCode, message, data) => {
  if (!isError) {
    return res.status(statusCode).json({
      message: message,
      data,
    });
  }
  return res.status(statusCode).json({
    message: message,
  });
};

exports.encryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};

exports.comparePassword = (newPassword, oldPassword) => {
  return bcrypt.compare(newPassword, oldPassword);
};
