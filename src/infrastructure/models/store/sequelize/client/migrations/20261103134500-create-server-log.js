"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("server_log", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      affected: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },

      entity: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },

      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex(
      "server_log",
      ["user_id"],
      { name: "idx_server_log_user_id" },
    );

    await queryInterface.addIndex(
      "server_log",
      ["entity", "action"],
      { name: "idx_server_log_entity_action" },
    );

    await queryInterface.addIndex(
      "server_log",
      ["created_at"],
      { name: "idx_server_log_created_at" },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("server_log");
  },
};
