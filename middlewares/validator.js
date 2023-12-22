const { response } = require("../helpers/common");

exports.validator = (schema) => {
  return async (req, res, next) => {
    try {
      const inputValues = { ...req.body, ...req.params, ...req.query };

      if (req.file) {
        inputValues.file = req.file;
      }
      if (req.files) {
        inputValues.files = req.files;
      }
      // console.log('inputValues >>>', inputValues);
      const { error } = await schema.validateAsync(inputValues, {
        allowUnknown: true,
        abortEarly: false,
      });
      if (error) return response(res, true, 400, error.message);
      next();
    } catch (error) {
      return response(res, true, 400, error.message);
    }
  };
};
