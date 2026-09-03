const express = require('express');
const router = express.Router();
const MongoMetric = require('../models/MongoMetric');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET /mongo/metrics — список всех метрик
router.get('/', authenticate, async (req, res) => {
  try {
    const metrics = await MongoMetric.find().sort({ createdAt: -1 });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /mongo/metrics/:id — одна метрика по id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const metric = await MongoMetric.findById(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /mongo/metrics — создать метрику
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, value, unit, category, trend, tags } = req.body;
    const metric = await MongoMetric.create({
      name, value, unit, category, trend,
      tags: tags || [],
      history: [{ value }],
    });
    res.status(201).json(metric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /mongo/metrics/:id — обновить метрику
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, value, unit, category, trend, tags } = req.body;
    const metric = await MongoMetric.findByIdAndUpdate(
      req.params.id,
      { name, value, unit, category, trend, tags },
      { new: true, runValidators: true }
    );
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json(metric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /mongo/metrics/:id — удалить метрику
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const metric = await MongoMetric.findByIdAndDelete(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json({ message: 'Deleted', metric });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /mongo/metrics/:id/history — добавить точку истории (вложенный документ)
router.post('/:id/history', authenticate, isAdmin, async (req, res) => {
  try {
    const { value, date } = req.body;
    const metric = await MongoMetric.findByIdAndUpdate(
      req.params.id,
      { $push: { history: { value, date: date || new Date() } } },
      { new: true }
    );
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json(metric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /mongo/metrics/:id/tags — добавить тег
router.post('/:id/tags', authenticate, isAdmin, async (req, res) => {
  try {
    const { tag } = req.body;
    const metric = await MongoMetric.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tags: tag } },
      { new: true }
    );
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json(metric);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
