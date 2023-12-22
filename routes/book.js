const { Router } = require("express");
const { validator } = require("../middlewares/validator");
const {
  getBooks,
  updateBook,
  deleteBook,
  createBook,
  issueBook,
  returnBook,
  dailyBookList,
} = require("../controllers/bookController");
const {
  bookSchema,
  createBookSchema,
  issueBookSchema,
  updateBookSchema,
} = require("../validators/bookValidator");
const { authGuard } = require("../middlewares/authGuard");
const { USER_TYPE } = require("../config/config");
const router = Router();

router.get("/", authGuard(), getBooks);
router.post(
  "/",
  authGuard([USER_TYPE.ADMIN]),
  validator(createBookSchema),
  createBook
);
router.put(
  "/:bookId",
  authGuard([USER_TYPE.ADMIN]),
  validator(updateBookSchema),
  updateBook
);
router.delete(
  "/:bookId",
  authGuard([USER_TYPE.ADMIN]),
  validator(bookSchema),
  deleteBook
);
router.post(
  "/issue/:bookId",
  authGuard([USER_TYPE.ADMIN]),
  validator(issueBookSchema),
  issueBook
);
router.post(
  "/return/:bookId",
  authGuard([USER_TYPE.ADMIN]),
  validator(bookSchema),
  returnBook
);
router.get("/dashboard", authGuard([USER_TYPE.ADMIN]), dailyBookList);

module.exports = router;
