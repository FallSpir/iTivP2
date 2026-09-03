const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true },
}, { _id: false });

const mongoMetricSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  value:    { type: Number, required: true },
  unit:     { type: String, default: '' },
  category: { type: String, default: 'general' },
  trend:    { type: Number, default: 0 },
  tags:     [String],
  history:  [historyEntrySchema],
}, { timestamps: true });

mongoMetricSchema.index({ category: 1 });

module.exports = mongoose.model('MongoMetric', mongoMetricSchema);
