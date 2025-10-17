"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class Guard extends sequelize_1.Model {
}
Guard.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    guard_chief: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    delegation_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'delegations', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Guard',
    tableName: 'guards',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['guard_chief'] },
        { fields: ['delegation_id'] },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = Guard;
