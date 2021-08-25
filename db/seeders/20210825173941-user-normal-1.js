'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const data = {
  role: 'normal',
  firstName: 'Alejandro',
  lastName: 'Juarez',
  username: 'user-normal-1',
  email: 'userNormal1@email.com',
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
