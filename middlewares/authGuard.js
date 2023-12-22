const { serverError, response } = require("../helpers/common");
const userModel = require("../models/userModel");
const { verifyJwtToken } = require("../utils/jwtService");

exports.authGuard = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.headers?.authorization) {
        return response(
          res,
          false,
          401,
          "Token not provided, please sign-in first."
        );
      }
      if (req.headers.authorization?.split(" ")[0] !== "Bearer") {
        return response(
          res,
          false,
          401,
          "Unauthorized access! Invalid token found"
        );
      }
      const decoded = await verifyJwtToken(
        req?.headers?.authorization?.split(" ")[1]
      );
      const foundUser = await userModel.findOne({ _id: decoded.id });
      if (!foundUser) {
        return response(
          res,
          false,
          401,
          "Unauthorized access! User not found."
        );
      }
      req.user = { _id: foundUser._id, role: foundUser.role };
      if (!roles) {
        return next();
      }
      if (!roles.includes(decoded.role)) {
        return response(
          res,
          false,
          401,
          `Unauthorized access! ${roles} role required.`
        );
      }
      return next();
    } catch (error) {
      error.code < 500
        ? response(res,false, error.code, error.message)
        : serverError(res, error);
    }
  };
};
