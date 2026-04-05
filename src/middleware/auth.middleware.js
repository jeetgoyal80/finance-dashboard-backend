const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/api-error');
const catchAsync = require('../utils/catch-async');
const { verifyToken } = require('../utils/token');
const { USER_STATUSES } = require('../utils/constants');

const authenticate = catchAsync(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token is missing or invalid.');
  }

  const token = authorizationHeader.split(' ')[1];
  const decodedToken = verifyToken(token);
  const user = await userRepository.findById(decodedToken.userId);

  if (!user) {
    throw new ApiError(401, 'User associated with this token does not exist.');
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'Your account is inactive. Please contact an administrator.');
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };

  next();
});

module.exports = {
  authenticate
};
