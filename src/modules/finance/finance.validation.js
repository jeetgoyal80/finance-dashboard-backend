const { body, param, query } = require('express-validator');
const { RECORD_TYPES } = require('../../utils/constants');

const createRecordValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number.'),
  body('type').isIn(Object.values(RECORD_TYPES)).withMessage('Type must be income or expense.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('date').isISO8601().withMessage('A valid date is required.'),
  body('description').optional().isString().withMessage('Description must be a string.')
];

const listRecordsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('type').optional().isIn(Object.values(RECORD_TYPES)).withMessage('Invalid record type.'),
  query('category').optional().isString().withMessage('Category must be a string.'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date.'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date.'),
  query('search').optional().isString().withMessage('Search must be a string.')
];

const updateRecordValidation = [
  param('id').isMongoId().withMessage('Invalid record id.'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number.'),
  body('type').optional().isIn(Object.values(RECORD_TYPES)).withMessage('Type must be income or expense.'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty.'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date.'),
  body('description').optional().isString().withMessage('Description must be a string.')
];

const deleteRecordValidation = [param('id').isMongoId().withMessage('Invalid record id.')];

module.exports = {
  createRecordValidation,
  listRecordsValidation,
  updateRecordValidation,
  deleteRecordValidation
};
