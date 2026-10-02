const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Log;
