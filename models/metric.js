const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Metric = sequelize.define('Metric', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trend: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = Metric;
