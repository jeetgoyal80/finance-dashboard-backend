const FinanceRecord = require('../modules/finance/finance.model');

const createRecord = (payload) => FinanceRecord.create(payload);

const findById = (recordId) => FinanceRecord.findById(recordId);

const findMany = ({ filters = {}, skip = 0, limit = 10, sort = { date: -1, createdAt: -1 } }) => {
  return FinanceRecord.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email role');
};

const countDocuments = (filters = {}) => FinanceRecord.countDocuments(filters);

const updateById = (recordId, payload) => {
  return FinanceRecord.findByIdAndUpdate(recordId, payload, {
    new: true,
    runValidators: true
  }).populate('createdBy', 'name email role');
};

const aggregate = (pipeline) => FinanceRecord.aggregate(pipeline);

module.exports = {
  createRecord,
  findById,
  findMany,
  countDocuments,
  updateById,
  aggregate
};
