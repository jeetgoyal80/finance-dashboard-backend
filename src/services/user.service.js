const mongoose = require('mongoose');

const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/api-error');
const { buildPagination } = require('../utils/query');

const getUsers = async (query) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = {};

  if (query.role) {
    filters.role = query.role;
  }

  if (query.status) {
    filters.status = query.status;
  }

  const [users, total] = await Promise.all([
    userRepository.findMany({ filters, skip, limit }),
    userRepository.countDocuments(filters)
  ]);

  return {
    items: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

const getUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user id.');
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

const updateUser = async (userId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user id.');
  }

  const user = await userRepository.updateById(userId, payload);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

module.exports = {
  getUsers,
  getUserById,
  updateUser
};
