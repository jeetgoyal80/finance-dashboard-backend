const authService = require('../../services/auth.service');
const catchAsync = require('../../utils/catch-async');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: result
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully.',
    data: user
  });
});

module.exports = {
  register,
  login,
  getProfile
};
