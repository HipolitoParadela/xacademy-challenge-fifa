'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.createTable(
      'player_skills',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        player_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        fifa_version_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        skill_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        value: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
    );

    await queryInterface.addConstraint(
      'player_skills',
      {
        fields: [
          'player_id',
          'fifa_version_id',
          'skill_id',
        ],

        type: 'unique',

        name:
          'unique_player_skill_version',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'player_skills',
    );
  },
};
