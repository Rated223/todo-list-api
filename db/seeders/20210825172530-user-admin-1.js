'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const data = {
  role: 'ADMIN',
  firstName: 'Daniel',
  lastName: 'Carrizales',
  username: 'user-admin-1',
  email: 'userAdmin1@email.com',
  password: bcrypt.hashSync('test', 8),
};

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [{ companyId: 1, ...data }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: data.email }, {});
  },
};
