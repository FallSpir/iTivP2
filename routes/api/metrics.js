const express = require('express');
const router = express.Router();
const Metric = require('../../models/metric');

const CATEGORIES = ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'];

function validateMetric({ name, value, unit, category, trend }) {
  const errors = [];
  const cleanName = (typeof name === 'string' ? name : '').trim();
  if (!cleanName || cleanName.length > 10) errors.push('name: от 1 до 10 символов.');
  const parsedValue = parseFloat(value);
  if (!isFinite(parsedValue) || parsedValue < 0 || parsedValue > 999999)
    errors.push('value: число от 0 до 999999.');
  const cleanUnit = (typeof unit === 'string' ? unit : '').trim();
  if (!cleanUnit || cleanUnit.length > 10 || !/^[A-Za-zА-Яа-яЁё%]+$/.test(cleanUnit))
    errors.push('unit: только буквы и %, не более 10 символов.');
  if (!CATEGORIES.includes(category))
    errors.push(`category: одно из ${CATEGORIES.join(', ')}.`);
  const parsedTrend = (trend === '' || trend === undefined || trend === null) ? 0 : parseFloat(trend);
  if (!isFinite(parsedTrend) || parsedTrend < -9999 || parsedTrend > 9999)
    errors.push('trend: число от -9999 до 9999.');
  return { errors, cleanName, parsedValue, cleanUnit, parsedTrend };
}

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Управление бизнес-метриками
 */

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Список всех метрик
 *     tags: [Metrics]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [Finance, Marketing, Sales, Operations, HR] }
 *         description: Фильтр по категории
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [name, value, trend] }
 *         description: Поле сортировки
 *       - in: query
 *         name: dir
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *         description: Направление сортировки
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Элементов на странице
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:  { type: array, items: { $ref: '#/components/schemas/Metric' } }
 *                 total: { type: integer, example: 25 }
 *                 page:  { type: integer, example: 1 }
 *                 pages: { type: integer, example: 3 }
 */
router.get('/', async (req, res) => {
  try {
    const { category, sort, dir, page = 1, limit = 10 } = req.query;
    const where = category && CATEGORIES.includes(category) ? { category } : {};
    const D = dir === 'asc' ? 'ASC' : 'DESC';
    const order = sort === 'value' ? [['value', D]]
      : sort === 'trend' ? [['trend', D]]
      : sort === 'name'  ? [['name', D]]
      : [['createdAt', D]];
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Metric.findAndCountAll({ where, order, limit: parseInt(limit), offset });
    res.json({ data: rows, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/metrics/{id}:
 *   get:
 *     summary: Получить метрику по ID
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Метрика найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Metric' }
 *       404:
 *         description: Не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:id', async (req, res) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/metrics:
 *   post:
 *     summary: Создать метрику
 *     tags: [Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MetricInput' }
 *     responses:
 *       201:
 *         description: Создана
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Metric' }
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 */
router.post('/', async (req, res) => {
  try {
    const { errors, cleanName, parsedValue, cleanUnit, parsedTrend } = validateMetric(req.body);
    if (errors.length) return res.status(400).json({ errors });
    const metric = await Metric.create({
      name: cleanName, value: parsedValue, unit: cleanUnit,
      category: req.body.category, trend: parsedTrend,
    });
    res.status(201).json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/metrics/{id}:
 *   put:
 *     summary: Полное обновление метрики
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MetricInput' }
 *     responses:
 *       200:
 *         description: Обновлена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Metric' }
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       404:
 *         description: Не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.put('/:id', async (req, res) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    const { errors, cleanName, parsedValue, cleanUnit, parsedTrend } = validateMetric(req.body);
    if (errors.length) return res.status(400).json({ errors });
    await metric.update({ name: cleanName, value: parsedValue, unit: cleanUnit, category: req.body.category, trend: parsedTrend });
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/metrics/{id}:
 *   patch:
 *     summary: Частичное обновление метрики
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:     { type: string, maxLength: 10 }
 *               value:    { type: number, minimum: 0, maximum: 999999 }
 *               unit:     { type: string, maxLength: 10 }
 *               category: { type: string, enum: [Finance, Marketing, Sales, Operations, HR] }
 *               trend:    { type: number, minimum: -9999, maximum: 9999 }
 *     responses:
 *       200:
 *         description: Обновлена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Metric' }
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       404:
 *         description: Не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.patch('/:id', async (req, res) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    const updates = {};
    const errors = [];
    if (req.body.name !== undefined) {
      const cleanName = String(req.body.name).trim();
      if (!cleanName || cleanName.length > 10) errors.push('name: от 1 до 10 символов.');
      else updates.name = cleanName;
    }
    if (req.body.value !== undefined) {
      const v = parseFloat(req.body.value);
      if (!isFinite(v) || v < 0 || v > 999999) errors.push('value: число от 0 до 999999.');
      else updates.value = v;
    }
    if (req.body.unit !== undefined) {
      const cleanUnit = String(req.body.unit).trim();
      if (!cleanUnit || cleanUnit.length > 10 || !/^[A-Za-zА-Яа-яЁё%]+$/.test(cleanUnit))
        errors.push('unit: только буквы и %, не более 10 символов.');
      else updates.unit = cleanUnit;
    }
    if (req.body.category !== undefined) {
      if (!CATEGORIES.includes(req.body.category)) errors.push(`category: одно из ${CATEGORIES.join(', ')}.`);
      else updates.category = req.body.category;
    }
    if (req.body.trend !== undefined) {
      const t = parseFloat(req.body.trend);
      if (!isFinite(t) || t < -9999 || t > 9999) errors.push('trend: число от -9999 до 9999.');
      else updates.trend = t;
    }
    if (errors.length) return res.status(400).json({ errors });
    if (Object.keys(updates).length === 0) return res.status(400).json({ errors: ['Нет полей для обновления.'] });
    await metric.update(updates);
    res.json(metric);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/metrics/{id}:
 *   delete:
 *     summary: Удалить метрику
 *     tags: [Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Удалена
 *       404:
 *         description: Не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.delete('/:id', async (req, res) => {
  try {
    const metric = await Metric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Metric not found' });
    await metric.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
