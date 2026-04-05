const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

module.exports = {
  registerValidation,
  loginValidation
};
