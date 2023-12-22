const { Router } = require("express");
const { validator } = require("../middlewares/validator");
const { userSignInSchema } = require("../validators/authValidator");
const { signIn } = require("../controllers/authController");
const router = Router();

router.post("/sign-in", validator(userSignInSchema), signIn);

module.exports = router;