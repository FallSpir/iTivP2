const express = require('express');
const router = express.Router();
const Metric = require('../models/metric');
const Log = require('../models/log');

const CATEGORIES = ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'];

function validateMetricInput({ name, value, unit, category, trend }) {
  const errors = [];

  const cleanName = (typeof name === 'string' ? name : '').trim();
  if (!cleanName || cleanName.length > 10) errors.push('Название: от 1 до 10 символов.');

  const parsedValue = parseFloat(value);
  if (!isFinite(parsedValue) || parsedValue < 0 || parsedValue > 999999)
    errors.push('Значение: число от 0 до 999999.');

  const cleanUnit = (typeof unit === 'string' ? unit : '').trim();
  if (!cleanUnit || cleanUnit.length > 10 || !/^[A-Za-zА-Яа-яЁё%]+$/.test(cleanUnit))
    errors.push('Единица: только буквы и %, не более 10 символов.');

  if (!CATEGORIES.includes(category))
    errors.push('Категория: выберите из списка.');

  const parsedTrend = (trend === '' || trend === undefined || trend === null)
    ? 0 : parseFloat(trend);
  if (!isFinite(parsedTrend) || parsedTrend < -9999 || parsedTrend > 9999)
    errors.push('Тренд: число от -9999 до 9999.');

  return { errors, cleanName, parsedValue, cleanUnit, parsedTrend };
}

router.get('/', async (req, res, next) => {                                    //18(router.get('/', checkAuth, checkRole, async (req, res, next) => { ... });)
  try {
    const { category, sort } = req.query;
    const where = category && category !== 'All' ? { category } : {};
    const order = sort === 'value' ? [['value', 'DESC']]
      : sort === 'trend' ? [['trend', 'DESC']]
      : sort === 'name' ? [['name', 'ASC']]
      : [['createdAt', 'DESC']];
    const metrics = await Metric.findAll({ where, order });
    const authSuffix = req.query.auth === '1' ? '?auth=1' : '';
    res.render('index', { metrics, user: req.user, categories: CATEGORIES, activeCategory: category || 'All', sort: sort || '', authSuffix });
  } catch (err) {
    next(err);
  }
});

router.get('/add', (req, res) => {
  if (req.user.name !== 'Администратор') return res.status(403).render('403', { user: req.user });
  res.render('add', { user: req.user, error: null, fields: null });
});

router.post('/add', async (req, res, next) => {
  try {
    if (req.user.name !== 'Администратор') return res.status(403).render('403', { user: req.user });
    const { name, value, unit, category, trend } = req.body;
    const { errors, cleanName, parsedValue, cleanUnit, parsedTrend } = validateMetricInput({ name, value, unit, category, trend });
    if (errors.length) {
      return res.status(400).render('add', { user: req.user, error: errors.join(' '), fields: { name, value, unit, category, trend } });
    }
    await Metric.create({ name: cleanName, value: parsedValue, unit: cleanUnit, category, trend: parsedTrend });
    res.redirect(req.query.auth === '1' ? '/?auth=1' : '/');
  } catch (err) {
    next(err);
  }
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    if (req.user.name !== 'Администратор') return res.status(403).render('403', { user: req.user });
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).render('404', { url: req.url, user: req.user });
    const authSuffix = req.query.auth === '1' ? '?auth=1' : '';
    res.render('edit', { user: req.user, metric, error: null, fields: null, authSuffix });
  } catch (err) {
    next(err);
  }
});

router.post('/edit/:id', async (req, res, next) => {
  try {
    if (req.user.name !== 'Администратор') return res.status(403).render('403', { user: req.user });
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).render('404', { url: req.url, user: req.user });
    const { name, value, unit, category, trend } = req.body;
    const { errors, cleanName, parsedValue, cleanUnit, parsedTrend } = validateMetricInput({ name, value, unit, category, trend });
    if (errors.length) {
      const authSuffix = req.query.auth === '1' ? '?auth=1' : '';
      return res.status(400).render('edit', { user: req.user, metric, error: errors.join(' '), fields: { name, value, unit, category, trend }, authSuffix });
    }
    await metric.update({ name: cleanName, value: parsedValue, unit: cleanUnit, category, trend: parsedTrend });
    res.redirect(`/item/${metric.id}${req.query.auth === '1' ? '?auth=1' : ''}`);
  } catch (err) {
    next(err);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    await Metric.destroy({ where: { id: req.params.id } });
    res.redirect(req.query.auth === '1' ? '/?auth=1' : '/');
  } catch (err) {
    next(err);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).render('404', { url: req.url, user: req.user });
    const authSuffix = req.query.auth === '1' ? '?auth=1' : '';
    res.render('item', { metric, user: req.user, authSuffix });
  } catch (err) {
    next(err);
  }
});

router.get('/logs', async (req, res, next) => {
  try {
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']], limit: 100 });
    res.render('logs', { logs, user: req.user, authSuffix: req.query.auth === '1' ? '?auth=1' : '' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
