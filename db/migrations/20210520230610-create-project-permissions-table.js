'use strict';

const tableName = 'project_permissions';
const catalog = [
  { description: 'See project' },
  { description: 'Create issues' },
  { description: 'Edit issues' },
  { description: 'Delete issues' },
  { description: 'Assign issue to user' },
  { description: 'Make comments' },
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
