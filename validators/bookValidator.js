const Joi = require("joi");

exports.bookSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
});

exports.createBookSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
});

exports.updateBookSchema = Joi.object({
  name: Joi.string().required(),
  bookId: Joi.string().hex().length(24).required(),
});

exports.issueBookSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  dueDate: Joi.date().required(),
});
