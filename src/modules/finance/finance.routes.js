const express = require('express');

const financeController = require('./finance.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../utils/constants');
const {
  createRecordValidation,
  listRecordsValidation,
  updateRecordValidation,
  deleteRecordValidation
} = require('./finance.validation');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validate(listRecordsValidation),
  financeController.getRecords
);

router.post('/', authorize(ROLES.ADMIN), validate(createRecordValidation), financeController.createRecord);
router.patch('/:id', authorize(ROLES.ADMIN), validate(updateRecordValidation), financeController.updateRecord);
router.delete('/:id', authorize(ROLES.ADMIN), validate(deleteRecordValidation), financeController.deleteRecord);

module.exports = router;
