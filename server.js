require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/db');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { notFound, serverError } = require('./middleware/errorHandler');
const metricsRouter = require('./routes/metrics');

require('./models/metric');
require('./models/log');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/* 17
app.use((req, res, next) => {
  req.body.name = req.body.name.trim();
  next();
});
 */
app.use(logger);
app.use(auth);

app.use('/', metricsRouter);

app.use(notFound);
app.use(serverError);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
