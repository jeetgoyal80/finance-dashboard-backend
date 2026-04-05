const express = require('express');

const authController = require('./auth.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
