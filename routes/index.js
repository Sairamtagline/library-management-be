const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/book", require("./book"));
router.use("/transaction", require("./transaction"));

module.exports = router;
