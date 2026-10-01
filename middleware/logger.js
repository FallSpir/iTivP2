module.exports = (req, res, next) => {
  const time = new Date().toLocaleTimeString('ru-RU');
  console.log(`[${req.method}] ${req.url} — ${time}`);
  next();
};
