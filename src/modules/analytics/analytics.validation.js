const { query } = require('express-validator');
const { RECORD_TYPES } = require('../../utils/constants');

const analyticsQueryValidation = [
  query('type').optional().isIn(Object.values(RECORD_TYPES)).withMessage('Invalid record type.'),
  query('category').optional().isString().withMessage('Category must be a string.'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date.'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date.'),
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20.')
];

module.exports = {
  analyticsQueryValidation
};
