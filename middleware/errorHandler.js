const notFound = (req, res) => {
  res.status(404).render('404', { url: req.url, user: req.user || { name: 'Гость' } });
};

const serverError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { message: err.message, user: req.user || { name: 'Гость' } });
};

module.exports = { notFound, serverError };
