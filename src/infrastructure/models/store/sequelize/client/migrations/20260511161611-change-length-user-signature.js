'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "signature", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "photo", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "signature", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.changeColumn("users", "photo", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
};
