require('dotenv').config();

module.exports = {
  development: {
    username: 'metrics_user',
    password: 'metrics123',
    database: 'metrics_dashboard',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
