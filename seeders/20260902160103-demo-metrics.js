'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Metrics', [
      { name: 'Revenue',         value: 125000, unit: 'USD',     category: 'finance',    trend: 8.3,  createdAt: new Date(), updatedAt: new Date() },
      { name: 'DAU',             value: 4320,   unit: 'users',   category: 'engagement', trend: 2.1,  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Conversion Rate', value: 3.7,    unit: '%',       category: 'sales',      trend: -0.5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Avg Order Value', value: 89.5,   unit: 'USD',     category: 'finance',    trend: 4.2,  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Support Tickets', value: 142,    unit: 'tickets', category: 'support',    trend: -12,  createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Metrics', null, {});
  },
};
