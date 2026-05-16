'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'clubs',
      {
        id: {
          type: Sequelize.INTEGER,

          autoIncrement: true,

          primaryKey: true,

          allowNull: false,
        },

        external_id: {
          type: Sequelize.INTEGER,

          allowNull: false,

          unique: true,
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
      'clubs',
    );
  },
};