const userModel = require("../models/userModel");
const { response, serverError, encryptPassword } = require("../helpers/common");
const transactionModel = require("../models/transactions");
const { default: mongoose } = require("mongoose");

exports.createUser = async (req, res) => {
  try {
    const { userName, name, email, password, contact } = req.body;
    const isUsernameExists = await userModel
      .findOne({ userName: userName })
      .lean();
    if (isUsernameExists) {
      return response(res, true, 400, "Username already exists");
    }

    const isEmailExists = await userModel.findOne({ email: email }).lean();
    if (isEmailExists) {
      return response(res, true, 400, "Email already exists");
    }
    const user = new userModel({
      role: "USER",
      userName,
      name,
      email,
      contact,
      password: await encryptPassword(password),
    });
    const userWithoutPassword = {
      role: user.role,
      userName: user.userName,
      name: user.name,
      email: user.email,
      contact: user.contact,
    };
    await userModel.create(user);
    return response(res, false, 200, "User created successfully", userWithoutPassword);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.param;
    const updateUser = req.body.updateUser;
    const { userName, email, password, name, contact } = updateUser;

    const user = userModel.findById(new mongoose.Types.ObjectId(userId)).lean();

    if (!user) {
      return response(res, true, 400, "User not found");
    }
    if (userName) {
      const isUsernameExists = await userModel.findOne({ userName }).lean();
      if (isUsernameExists && isUsernameExists._id.toString() !== userId.toString()) {
        return response(res, true, 400, "Username already exists");
      }
    }
    if (email) {
      const isEmailExists = await userModel.findOne({ email }).lean();
      if (isEmailExists && isEmailExists._id.toString() !== userId.toString()) {
        return response(res, true, 400, "Email already exists");
      }
    }

    const updateFields = {
      ...(userName ? { userName } : {}),
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
      ...(contact ? { contact } : {}),
      ...(password ? { password: encryptPassword(password) } : {}),
    };

    const projection = {
      _id: 1,
      ...updateFields,
      ...(password ? {} : { password: 0 }),
    };
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: updateFields,
      },
      { new: true, projection }
    );
    return response(res, false, 200, "User updated successfully", updatedUser);
  } catch (error) {
    return serverError(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const user = await userModel.findById(userId);
    if (!user) {
      return response(res, true, 404, "User not found");
    }

    await Promise.all([
      userModel.deleteOne({ _id: userId }),
      transactionModel.deleteMany({ userId }),
    ]);
    return response(res, false, 200, "User deleted successfully");
  } catch (error) {
    return serverError(res, error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: "USER" }, { userName: 1, name: 1, email: 1, contact: 1 })
      .sort({ createdAt: -1 })
      .lean();

    return response(res, false, 200, "success", users);
  } catch (error) {
    return serverError(res, error);
  }
};
