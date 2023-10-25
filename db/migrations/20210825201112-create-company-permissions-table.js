'use strict';

const tableName = 'company_permissions';
const catalog = [
  { description: 'Disable user' },
  { description: 'Edit user permissions' },
  { description: 'Create projects' },
  { description: 'Delete projects' },
  { description: 'Edit projects' },
  { description: 'Assign project permissions' },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.bulkInsert(tableName, catalog, {});
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(tableName);
  },
};
