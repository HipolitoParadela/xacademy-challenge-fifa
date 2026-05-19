'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('admin', 10);

    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: password,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      username: 'admin',
    });
  },
};