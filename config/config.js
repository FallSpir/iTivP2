require('dotenv').config();

module.exports = {
  development: {
    username: 'metrics_user',
    password: 'metrics123',
    database: 'metrics_dashboard',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
};
