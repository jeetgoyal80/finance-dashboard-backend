const financeService = require('../../services/finance.service');
const catchAsync = require('../../utils/catch-async');

const createRecord = catchAsync(async (req, res) => {
  const record = await financeService.createRecord(req.body, req.user);

  res.status(201).json({
    success: true,
    message: 'Financial record created successfully.',
    data: record
  });
});

const getRecords = catchAsync(async (req, res) => {
  const result = await financeService.getRecords(req.query);

  res.status(200).json({
    success: true,
    message: 'Financial records fetched successfully.',
    data: result
  });
});

const updateRecord = catchAsync(async (req, res) => {
  const record = await financeService.updateRecord(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Financial record updated successfully.',
    data: record
  });
});

const deleteRecord = catchAsync(async (req, res) => {
  const record = await financeService.deleteRecord(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Financial record deleted successfully.',
    data: record
  });
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
