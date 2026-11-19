"use strict";

const origins = [
  ["supplies_ambulances", "pharmacy_supply_id", "supplies"],
  ["answers_supplies", "ambulance_supply_id", "supplies_ambulances"],
  ["supply_report_items", "checklist_answer_id", "answers_supplies"],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const [table, column, parent] of origins) {
      const columns = await queryInterface.describeTable(table);
      if (!columns[column]) {
        await queryInterface.addColumn(table, column, {
          type: Sequelize.UUID,
          allowNull: true,
          defaultValue: null,
        });
      }
      // TiDB needs the column to exist before adding its foreign key.
      const references = await queryInterface.getForeignKeyReferencesForTable(table);
      if (!references.some((reference) => reference.columnName === column)) {
        await queryInterface.addConstraint(table, {
          fields: [column], type: "foreign key", name: `fk_${table}_${column}`,
          references: { table: parent, field: "id" },
          onUpdate: "CASCADE", onDelete: "SET NULL",
        });
      }
    }
  },
  async down(queryInterface) {
    for (const [table, column] of [...origins].reverse()) {
      const columns = await queryInterface.describeTable(table);
      if (!columns[column]) continue;
      const references = await queryInterface.getForeignKeyReferencesForTable(table);
      for (const reference of references.filter((entry) => entry.columnName === column)) {
        await queryInterface.removeConstraint(table, reference.constraintName);
      }
      await queryInterface.removeColumn(table, column);
    }
  },
};
