require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { sequelize } = require('./models');
const metricsRouter = require('./routes/metrics');
const authRouter = require('./routes/auth');
const mongoMetricsRouter = require('./routes/mongoMetrics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Business Metrics Dashboard API', version: '4.0.0' });
});

app.use('/auth', authRouter);
app.use('/metrics', metricsRouter);
app.use('/mongo/metrics', mongoMetricsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
