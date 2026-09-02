const { Metric } = require('../models');

const REQUIRED_FIELDS = ['name', 'value', 'unit', 'category'];

function validateBody(data) {
  const missing = REQUIRED_FIELDS.filter(f => data[f] === undefined || data[f] === '');
  if (missing.length > 0) return `Missing required fields: ${missing.join(', ')}`;
  if (typeof data.value !== 'number') return '"value" must be a number';
  return null;
}

async function getAllMetrics(req, res, next) {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;
    const metrics = await Metric.findAll({ where });
    res.json(metrics);
  } catch (err) { next(err); }
}

async function getMetricById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID must be a number' });
    const metric = await Metric.findByPk(id);
    if (!metric) return res.status(404).json({ error: `Metric with id ${id} not found` });
    res.json(metric);
  } catch (err) { next(err); }
}

async function createMetric(req, res, next) {
  try {
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ error });
    const metric = await Metric.create(req.body);
    res.status(201).json(metric);
  } catch (err) { next(err); }
}

async function updateMetric(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID must be a number' });
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ error });
    const metric = await Metric.findByPk(id);
    if (!metric) return res.status(404).json({ error: `Metric with id ${id} not found` });
    await metric.update(req.body);
    res.json(metric);
  } catch (err) { next(err); }
}

async function deleteMetric(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID must be a number' });
    const metric = await Metric.findByPk(id);
    if (!metric) return res.status(404).json({ error: `Metric with id ${id} not found` });
    await metric.destroy();
    res.status(200).json({ message: `Metric ${id} deleted successfully` });
  } catch (err) { next(err); }
}

module.exports = { getAllMetrics, getMetricById, createMetric, updateMetric, deleteMetric };
