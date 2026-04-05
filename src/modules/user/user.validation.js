const { query, param, body } = require('express-validator');
const { ROLES, USER_STATUSES } = require('../../utils/constants');

const listUsersValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role provided.'),
  query('status').optional().isIn(Object.values(USER_STATUSES)).withMessage('Invalid status provided.')
];

const getUserValidation = [param('id').isMongoId().withMessage('Invalid user id.')];

const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user id.'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
  body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role provided.'),
  body('status').optional().isIn(Object.values(USER_STATUSES)).withMessage('Invalid status provided.')
];

module.exports = {
  listUsersValidation,
  getUserValidation,
  updateUserValidation
};
