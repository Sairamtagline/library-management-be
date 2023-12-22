exports.newCustomError = ({statusCode, message}) =>{
  const error = new Error(message);
  error.code = statusCode;
  return error
}