const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../utils/token');
const { ROLES, USER_STATUSES } = require('../utils/constants');

const buildAuthResponse = (user) => {
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};

const register = async (payload) => {
  const existingUser = await userRepository.findByEmail(payload.email);

  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  const user = await userRepository.createUser({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: ROLES.VIEWER,
    status: USER_STATUSES.ACTIVE
  });

  return buildAuthResponse(user);
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, { includePassword: true });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'Your account is inactive. Please contact an administrator.');
  }

  return buildAuthResponse(user);
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

module.exports = {
  register,
  login,
  getProfile
};
