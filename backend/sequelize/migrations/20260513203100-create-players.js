'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'players',
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
        },

        genero: {
          type: Sequelize.ENUM(
            'male',
            'female',
          ),

          allowNull: false,
        },

        image: {
          type: Sequelize.STRING,

          allowNull: true,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'players',
    );
  },
};
