const ApiError = require('../utils/api-error');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication is required before authorization.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource.'));
    }

    next();
  };
};

module.exports = {
  authorize
};
