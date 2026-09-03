'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Metric extends Model {
    static associate(models) {}
  }
  Metric.init({
    name: DataTypes.STRING,
    value: DataTypes.FLOAT,
    unit: DataTypes.STRING,
    category: DataTypes.STRING,
    trend: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Metric',
  });
  return Metric;
};