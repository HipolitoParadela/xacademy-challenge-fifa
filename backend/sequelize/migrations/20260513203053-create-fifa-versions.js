'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'fifa_versions',
      {
        id: {
          type: Sequelize.INTEGER,

          autoIncrement: true,

          primaryKey: true,

          allowNull: false,
        },

        version_number: {
          type: Sequelize.STRING,

          allowNull: false,

          unique: true,
        },

        year: {
          type: Sequelize.INTEGER,

          allowNull: false,
        },

        createdAt: {
          type: Sequelize.DATE,

          allowNull: false,
        },

        updatedAt: {
          type: Sequelize.DATE,

          allowNull: false,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'fifa_versions',
    );
  },
};