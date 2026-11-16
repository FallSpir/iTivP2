const express = require('express');
const router = express.Router();
const Log = require('../../models/log');

function parseId(raw) {
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Журнал запросов
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Список записей журнала
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *         description: Максимальное количество записей
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:  { type: array, items: { $ref: '#/components/schemas/Log' } }
 *                 total: { type: integer }
 */
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']], limit });
    const total = await Log.count();
    res.json({ data: logs, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/logs/{id}:
 *   get:
 *     summary: Получить запись журнала по ID
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Log' }
 *       404:
 *         description: Не найдена
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const log = await Log.findByPk(id);
    if (!log) return res.status(404).json({ error: 'Log entry not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/logs/{id}:
 *   delete:
 *     summary: Удалить запись журнала
 *     tags: [Logs]
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
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const log = await Log.findByPk(id);
    if (!log) return res.status(404).json({ error: 'Log entry not found' });
    await log.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
