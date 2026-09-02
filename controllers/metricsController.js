const model = require('../models/metricsModel');

const REQUIRED_FIELDS = ['name', 'value', 'unit', 'category'];

function validateBody(data) {
  const missing = REQUIRED_FIELDS.filter(f => data[f] === undefined || data[f] === '');
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  if (typeof data.value !== 'number') {
    return '"value" must be a number';
  }
  return null;
}

function getAllMetrics(req, res) {
  const { category } = req.query;
  let data = model.getAll();
  if (category) {
    data = data.filter(m => m.category === category);
  }
  res.json(data);
}

function getMetricById(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }
  const metric = model.getById(id);
  if (!metric) {
    return res.status(404).json({ error: `Metric with id ${id} not found` });
  }
  res.json(metric);
}

function createMetric(req, res) {
  const error = validateBody(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const metric = model.create(req.body);
  res.status(201).json(metric);
}

function updateMetric(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }
  const error = validateBody(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const metric = model.update(id, req.body);
  if (!metric) {
    return res.status(404).json({ error: `Metric with id ${id} not found` });
  }
  res.json(metric);
}

function deleteMetric(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID must be a number' });
  }
  const deleted = model.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: `Metric with id ${id} not found` });
  }
  res.status(200).json({ message: `Metric ${id} deleted successfully` });
}

module.exports = { getAllMetrics, getMetricById, createMetric, updateMetric, deleteMetric };
