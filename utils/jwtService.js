const jwt = require("jsonwebtoken");
const { JWT } = require("../config/config");
const { newCustomError } = require("./throwCustomError");

exports.makeJwtToken = async (claims, expires) => {
  return jwt.sign(claims, JWT.SECRET, { expiresIn: expires });
};
exports.verifyJwtToken = async (token) => {
  return jwt.verify(token, JWT.SECRET, (error, decoded) => {
    if (error) {
      // let newError = new Error();
      // newError.code = 401;
      // newError.message = error.message;
      // throw newError;
      throw newCustomError({ statusCode: 401, message: `Unauthorized access! ${error.message}` });
    }
    return decoded;
  });
};