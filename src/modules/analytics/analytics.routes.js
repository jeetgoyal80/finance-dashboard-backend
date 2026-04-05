const express = require('express');

const analyticsController = require('./analytics.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { ROLES } = require('../../utils/constants');
const { analyticsQueryValidation } = require('./analytics.validation');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ANALYST, ROLES.ADMIN));

router.get('/dashboard', validate(analyticsQueryValidation), analyticsController.getDashboard);
router.get('/summary', validate(analyticsQueryValidation), analyticsController.getSummary);
router.get('/category-totals', validate(analyticsQueryValidation), analyticsController.getCategoryTotals);
router.get('/monthly-trends', validate(analyticsQueryValidation), analyticsController.getMonthlyTrends);
router.get('/recent-transactions', validate(analyticsQueryValidation), analyticsController.getRecentTransactions);

module.exports = router;
