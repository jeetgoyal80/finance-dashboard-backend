const userService = require('../../services/user.service');
const catchAsync = require('../../utils/catch-async');

const getUsers = catchAsync(async (req, res) => {
  const result = await userService.getUsers(req.query);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully.',
    data: result
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User fetched successfully.',
    data: user
  });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: user
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser
};
