"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Delegation extends sequelize_1.Model {
}
Delegation.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    state_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'states', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    municipality_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'municipalities', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    pharmacy_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'pharmacies', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Delegation',
    tableName: 'delegations',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['state_id'] },
        { fields: ['municipality_id'] },
        { fields: ['pharmacy_id'] },
        { unique: true, fields: ['state_id', 'municipality_id', 'pharmacy_id'], name: 'uq_delegation_triple' },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = Delegation;
