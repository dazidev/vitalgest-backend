"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class AnswerSupply extends sequelize_1.Model {
}
AnswerSupply.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    checklist_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: "checklist_supplies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    specification: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    avaible_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    min_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    required_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    measurement_unit: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    area_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "areas_ambulance", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: "AnswerSupply",
    tableName: "answers_supplies",
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
});
exports.default = AnswerSupply;
