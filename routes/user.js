const { Router } = require("express");
const { validator } = require("../middlewares/validator");
const {
  createUserSchema,
  updateUserSchema,
  deleteSchema,
} = require("../validators/userValidator");
const {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/userController");
const { authGuard } = require("../middlewares/authGuard");
const { USER_TYPE } = require("../config/config");
const router = Router();

router.use(authGuard([USER_TYPE.ADMIN]))

router.get("/", getUsers);

router.post("/", validator(createUserSchema), createUser);

router.put("/:userId", validator(updateUserSchema), updateUser);

router.delete("/:userId", validator(deleteSchema), deleteUser);

module.exports = router;
