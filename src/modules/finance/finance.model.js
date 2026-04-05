const mongoose = require('mongoose');

const { RECORD_TYPES } = require('../../utils/constants');

const financeRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

financeRecordSchema.index({ category: 1, type: 1, date: -1 });
financeRecordSchema.index({ description: 'text', category: 'text' });

module.exports = mongoose.model('FinanceRecord', financeRecordSchema);
