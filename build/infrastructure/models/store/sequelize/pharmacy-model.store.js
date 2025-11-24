"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Pharmacy extends sequelize_1.Model {
}
Pharmacy.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    delegation_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: "delegations", key: "id" },
        onUpdate: "CASCADE", // actualiza si el padre cambia de id
        onDelete: "CASCADE", // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: "Pharmacy",
    tableName: "pharmacies",
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
    indexes: [
        {
            unique: true,
            fields: ["delegation_id"],
            name: "uq_delegations_pharmacy",
        },
    ],
});
exports.default = Pharmacy;
