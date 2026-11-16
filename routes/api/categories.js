const express = require('express');
const router = express.Router();
const Metric = require('../../models/metric');
const { Op } = require('sequelize');

const CATEGORIES = ['Finance', 'Marketing', 'Sales', 'Operations', 'HR'];

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Категории метрик
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Список всех категорий с количеством метрик
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', async (req, res) => {
  try {
    const counts = await Promise.all(
      CATEGORIES.map(async (name) => {
        const count = await Metric.count({ where: { category: name } });
        return { name, count };
      })
    );
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/categories/{name}:
 *   get:
 *     summary: Получить категорию с её метриками
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string, enum: [Finance, Marketing, Sales, Operations, HR] }
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:    { type: string }
 *                 count:   { type: integer }
 *                 metrics: { type: array, items: { $ref: '#/components/schemas/Metric' } }
 *       404:
 *         description: Категория не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (!CATEGORIES.includes(name)) return res.status(404).json({ error: 'Category not found' });
    const metrics = await Metric.findAll({ where: { category: name }, order: [['createdAt', 'DESC']] });
    res.json({ name, count: metrics.length, metrics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
