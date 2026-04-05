const express = require('express');

const userController = require('./user.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../utils/constants');
const {
  listUsersValidation,
  getUserValidation,
  updateUserValidation
} = require('./user.validation');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(listUsersValidation), userController.getUsers);
router.get('/:id', validate(getUserValidation), userController.getUserById);
router.patch('/:id', validate(updateUserValidation), userController.updateUser);

module.exports = router;
