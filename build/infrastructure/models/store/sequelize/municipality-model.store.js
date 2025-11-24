"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Municipality extends sequelize_1.Model {
}
Municipality.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    state_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "states", key: "id" },
        onUpdate: "CASCADE", // actualiza si el padre cambia de id
        onDelete: "RESTRICT", // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: "Municipality",
    tableName: "municipalities",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["state_id"] }],
    // paranoid: true //* activa borrado lógico
});
exports.default = Municipality;
