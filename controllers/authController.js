const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { makeJwtToken } = require("../utils/jwtService");
const { response, serverError } = require("../helpers/common");
const { MESSAGES } = require("../config/constant");

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await userModel.findOne({ email: email });
    if (!userExist) {
      return response(res, true, 400, "User not found for given email!");
    }
    if (!bcrypt.compareSync(password, userExist.password)) {
      return response(res, true, 401, "Invalid password!");
    }
    const token = await makeJwtToken(
      { id: userExist._id, role: userExist.role },
      "30 day"
    );
    return response(res, false, 200, "Login Successful.", {
      name: userExist.name,
      email: userExist.email,
      role: userExist.role,
      accessToken: token,
    });
  } catch (error) {
    return serverError(res, error);
  }
};
