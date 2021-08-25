'use strict';

const data = {
  name: 'Company 1',
  email: 'company1@email.com',
  phone: '8112345678',
  web: 'company1.com',
};

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('companies', [data], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('companies', { name: data.name }, {});
  },
};
