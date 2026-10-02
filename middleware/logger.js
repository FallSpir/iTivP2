const Log = require('../models/log');

module.exports = (req, res, next) => {
  const time = new Date().toLocaleTimeString('ru-RU');
  console.log(`[${req.method}] ${req.url} — ${time}`);
  Log.create({ method: req.method, url: req.url }).catch(() => {});
  next();
};
