const analyticsService = require('../../services/analytics.service');
const catchAsync = require('../../utils/catch-async');

const getDashboard = catchAsync(async (req, res) => {
  const dashboard = await analyticsService.getDashboard(req.query);

  res.status(200).json({
    success: true,
    message: 'Dashboard analytics fetched successfully.',
    data: dashboard
  });
});

const getSummary = catchAsync(async (req, res) => {
  const summary = await analyticsService.getSummary(req.query);

  res.status(200).json({
    success: true,
    message: 'Summary analytics fetched successfully.',
    data: summary
  });
});

const getCategoryTotals = catchAsync(async (req, res) => {
  const categoryTotals = await analyticsService.getCategoryTotals(req.query);

  res.status(200).json({
    success: true,
    message: 'Category totals fetched successfully.',
    data: categoryTotals
  });
});

const getMonthlyTrends = catchAsync(async (req, res) => {
  const monthlyTrends = await analyticsService.getMonthlyTrends(req.query);

  res.status(200).json({
    success: true,
    message: 'Monthly trends fetched successfully.',
    data: monthlyTrends
  });
});

const getRecentTransactions = catchAsync(async (req, res) => {
  const recentTransactions = await analyticsService.getRecentTransactions(req.query);

  res.status(200).json({
    success: true,
    message: 'Recent transactions fetched successfully.',
    data: recentTransactions
  });
});

module.exports = {
  getDashboard,
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions
};
