'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'skills',
      {
        id: {
          type: Sequelize.INTEGER,

          autoIncrement: true,

          primaryKey: true,

          allowNull: false,
        },

        name: {
          type: Sequelize.STRING,

          allowNull: false,

          unique: true,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'skills',
    );
  },
};