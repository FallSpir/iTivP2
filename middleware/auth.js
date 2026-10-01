module.exports = (req, res, next) => {
  if (req.query.auth === '1') {
    req.user = { name: 'Администратор' };
  } else {
    req.user = { name: 'Гость' };
  }
  next();
};
