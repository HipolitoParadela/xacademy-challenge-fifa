'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      { code: 'CF', name: 'Delantero centro' },
      { code: 'LW', name: 'Extremo izquierdo' },
      { code: 'LM', name: 'Mediocampista izquierdo' },
      { code: 'RM', name: 'Mediocampista derecho' },
      { code: 'RW', name: 'Extremo derecho' },
      { code: 'ST', name: 'Delantero' },
      { code: 'GK', name: 'Arquero' },
      { code: 'CM', name: 'Mediocampista central' },
      { code: 'CDM', name: 'Mediocampista defensivo' },
      { code: 'RB', name: 'Lateral derecho' },
      { code: 'CB', name: 'Defensor central' },
      { code: 'CAM', name: 'Mediocampista ofensivo' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  },
};
