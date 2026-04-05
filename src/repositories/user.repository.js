const User = require('../modules/user/user.model');

const createUser = (payload) => User.create(payload);

const findByEmail = (email, options = {}) => {
  const query = User.findOne({ email: email.toLowerCase() });

  if (options.includePassword) {
    query.select('+password');
  }

  return query;
};

const findById = (userId, options = {}) => {
  const query = User.findById(userId);

  if (options.includePassword) {
    query.select('+password');
  }

  return query;
};

const findMany = ({ filters = {}, skip = 0, limit = 10 }) => {
  return User.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countDocuments = (filters = {}) => User.countDocuments(filters);

const updateById = (userId, payload) => {
  return User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true
  });
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  findMany,
  countDocuments,
  updateById
};
