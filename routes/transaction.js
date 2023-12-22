const { Router } = require("express");
const { getTransactions } = require("../controllers/transactionController");
const { authGuard } = require("../middlewares/authGuard");

const router = Router();

router.get("/",authGuard(), getTransactions);

module.exports = router;
