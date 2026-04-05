const financeRepository = require('../repositories/finance.repository');
const { buildRecordFilters } = require('./finance.service');

const buildAnalyticsMatchStage = (query = {}) => buildRecordFilters(query);

const getSummary = async (query) => {
  const pipeline = [
    { $match: buildAnalyticsMatchStage(query) },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] }
      }
    }
  ];

  const [summary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 }] = await financeRepository.aggregate(pipeline);
  return summary;
};

const getCategoryTotals = async (query) => {
  const pipeline = [
    { $match: buildAnalyticsMatchStage(query) },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type'
        },
        totalAmount: { $sum: '$amount' },
        transactionCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        type: '$_id.type',
        totalAmount: 1,
        transactionCount: 1
      }
    },
    { $sort: { totalAmount: -1 } }
  ];

  return financeRepository.aggregate(pipeline);
};

const getMonthlyTrends = async (query) => {
  const pipeline = [
    { $match: buildAnalyticsMatchStage(query) },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        totalAmount: { $sum: '$amount' },
        transactionCount: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month'
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$totalAmount', 0]
          }
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$totalAmount', 0]
          }
        },
        transactionCount: { $sum: '$transactionCount' }
      }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        income: 1,
        expenses: 1,
        netBalance: { $subtract: ['$income', '$expenses'] },
        transactionCount: 1
      }
    },
    { $sort: { year: 1, month: 1 } }
  ];

  return financeRepository.aggregate(pipeline);
};

const getRecentTransactions = async (query) => {
  const limit = Math.min(Math.max(Number(query.limit) || 5, 1), 20);
  const pipeline = [
    { $match: buildAnalyticsMatchStage(query) },
    { $sort: { date: -1, createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy'
      }
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        type: 1,
        category: 1,
        date: 1,
        description: 1,
        createdAt: 1,
        createdBy: {
          _id: '$createdBy._id',
          name: '$createdBy.name',
          email: '$createdBy.email',
          role: '$createdBy.role'
        }
      }
    }
  ];

  return financeRepository.aggregate(pipeline);
};

const getDashboard = async (query) => {
  const [summary, categoryTotals, monthlyTrends, recentTransactions] = await Promise.all([
    getSummary(query),
    getCategoryTotals(query),
    getMonthlyTrends(query),
    getRecentTransactions(query)
  ]);

  return {
    summary,
    categoryTotals,
    monthlyTrends,
    recentTransactions
  };
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions,
  getDashboard
};
