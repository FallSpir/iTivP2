'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Metric extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
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