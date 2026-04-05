const mongoose = require('mongoose');

const financeRepository = require('../repositories/finance.repository');
const ApiError = require('../utils/api-error');
const { buildPagination, escapeRegex } = require('../utils/query');

const buildRecordFilters = (query = {}) => {
  const filters = {
    isDeleted: false
  };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), 'i');
    filters.$or = [{ category: regex }, { description: regex }];
  }

  return filters;
};

const createRecord = async (payload, currentUser) => {
  const record = await financeRepository.createRecord({
    ...payload,
    createdBy: currentUser.id
  });

  return record.populate('createdBy', 'name email role');
};

const getRecords = async (query) => {
  const { page, limit, skip } = buildPagination(query.page, query.limit);
  const filters = buildRecordFilters(query);

  const [records, total] = await Promise.all([
    financeRepository.findMany({ filters, skip, limit }),
    financeRepository.countDocuments(filters)
  ]);

  return {
    items: records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

const updateRecord = async (recordId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(recordId)) {
    throw new ApiError(400, 'Invalid record id.');
  }

  const existingRecord = await financeRepository.findById(recordId);

  if (!existingRecord || existingRecord.isDeleted) {
    throw new ApiError(404, 'Financial record not found.');
  }

  return financeRepository.updateById(recordId, payload);
};

const deleteRecord = async (recordId) => {
  if (!mongoose.Types.ObjectId.isValid(recordId)) {
    throw new ApiError(400, 'Invalid record id.');
  }

  const existingRecord = await financeRepository.findById(recordId);

  if (!existingRecord || existingRecord.isDeleted) {
    throw new ApiError(404, 'Financial record not found.');
  }

  return financeRepository.updateById(recordId, {
    isDeleted: true,
    deletedAt: new Date()
  });
};

module.exports = {
  buildRecordFilters,
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
