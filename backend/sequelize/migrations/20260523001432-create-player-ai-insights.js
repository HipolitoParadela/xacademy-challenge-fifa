'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      'player_ai_insights',
      {
        id: {
          type:
            Sequelize.INTEGER,
          autoIncrement:
            true,
          primaryKey:
            true,
          allowNull:
            false,
        },

        player_id: {
          type:
            Sequelize.INTEGER,
          allowNull:
            false,
          unique:
            true,
          references: {
            model:
              'players',
            key:
              'id',
          },
          onDelete:
            'CASCADE',
        },

        summary: {
          type:
            Sequelize.TEXT,
          allowNull:
            false,
        },

        created_at: {
          allowNull:
            false,
          type:
            Sequelize.DATE,
          defaultValue:
            Sequelize.literal(
              'CURRENT_TIMESTAMP',
            ),
        },

        updated_at: {
          allowNull:
            false,
          type:
            Sequelize.DATE,
          defaultValue:
            Sequelize.literal(
              'CURRENT_TIMESTAMP',
            ),
        },
      },
    );
  },

  async down(
    queryInterface,
  ) {

    await queryInterface.dropTable(
      'player_ai_insights',
    );
  },
};