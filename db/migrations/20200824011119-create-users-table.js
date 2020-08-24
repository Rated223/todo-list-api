'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      role: {
        type: Sequelize.ENUM({
          values: ['ADMIN', 'NORMAL'],
        }),
        allowNull: false,
        defaultValue: 'NORMAL',
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  },
};
