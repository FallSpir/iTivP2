const express = require('express');
const router = express.Router();
const Metric = require('../models/metric');

const CATEGORIES = ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'];

router.get('/', async (req, res, next) => {
  try {
    const { category, sort } = req.query;
    const where = category && category !== 'All' ? { category } : {};
    const order = sort === 'value' ? [['value', 'DESC']]
      : sort === 'trend' ? [['trend', 'DESC']]
      : sort === 'name' ? [['name', 'ASC']]
      : [['createdAt', 'DESC']];
    const metrics = await Metric.findAll({ where, order });
    res.render('index', { metrics, user: req.user, categories: CATEGORIES, activeCategory: category || 'All', sort: sort || '' });
  } catch (err) {
    next(err);
  }
});

router.get('/add', (req, res) => {
  res.render('add', { user: req.user });
});

router.post('/add', async (req, res, next) => {
  try {
    const { name, value, unit, category, trend } = req.body;
    await Metric.create({ name, value: parseFloat(value), unit, category, trend: parseFloat(trend) || 0 });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    await Metric.destroy({ where: { id: req.params.id } });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).render('404', { url: req.url, user: req.user });
    res.render('item', { metric, user: req.user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
