'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Metrics', 'trend', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: 'Percentage change vs previous period',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Metrics', 'trend');
  },
};
