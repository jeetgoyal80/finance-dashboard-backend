const { validationResult } = require('express-validator');
const ApiError = require('../utils/api-error');

const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      return next(
        new ApiError(
          400,
          'Validation failed.',
          errors.array().map((error) => ({
            field: error.path,
            message: error.msg
          }))
        )
      );
    }
  ];
};

module.exports = validate;
