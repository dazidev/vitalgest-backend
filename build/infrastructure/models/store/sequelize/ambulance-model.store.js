"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Ambulance extends sequelize_1.Model {
}
Ambulance.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    number: { type: sequelize_1.DataTypes.STRING(100), allowNull: false, /*unique: true*/ },
    brand: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    model: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    delegation_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'delegations', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'CASCADE', // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Ambulance',
    tableName: 'ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['number'], name: 'uq_ambulances_number' },
        { fields: ['delegation_id'] },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = Ambulance;
