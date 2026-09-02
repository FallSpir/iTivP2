const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricsController');

router.get('/',      controller.getAllMetrics);
router.get('/:id',   controller.getMetricById);
router.post('/',     controller.createMetric);
router.put('/:id',   controller.updateMetric);
router.delete('/:id', controller.deleteMetric);

module.exports = router;
