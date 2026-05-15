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

          allowNull: false,
        },

        player_id: {
          type: Sequelize.INTEGER,

          allowNull: false,

          references: {
            model: {
              tableName: 'players',
            },

            key: 'id',
          },

          onDelete: 'CASCADE',

          onUpdate: 'CASCADE',
        },

        fifa_version_id: {
          type: Sequelize.INTEGER,

          allowNull: false,

          references: {
            model: {
              tableName:
                'fifa_versions',
            },

            key: 'id',
          },

          onDelete: 'CASCADE',

          onUpdate: 'CASCADE',
        },

        skill_id: {
          type: Sequelize.INTEGER,

          allowNull: false,

          references: {
            model: {
              tableName: 'skills',
            },

            key: 'id',
          },

          onDelete: 'CASCADE',

          onUpdate: 'CASCADE',
        },

        value: {
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
      'player_skills',
    );
  },
};
