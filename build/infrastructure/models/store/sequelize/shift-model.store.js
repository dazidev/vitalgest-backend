"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Shift extends sequelize_1.Model {
}
Shift.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'ambulances', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    guard_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'guards', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    paramedical_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    driver_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    checklist_supply_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'checklist_supplies', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    checklist_ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'checklist_ambulances', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Shift',
    tableName: 'shifts',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['guard_id'] },
        { fields: ['ambulance_id'] },
        { fields: ['paramedical_id'] },
        { fields: ['driver_id'] },
        { fields: ['checklist_supply_id'] },
        { fields: ['checklist_ambulance_id'] },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = Shift;
