'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricsController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/',       auth, controller.getAllMetrics);
router.get('/:id',    auth, controller.getMetricById);
router.post('/',      auth, isAdmin, controller.createMetric);
router.put('/:id',    auth, isAdmin, controller.updateMetric);
router.delete('/:id', auth, isAdmin, controller.deleteMetric);

module.exports = router;
