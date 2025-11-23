"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class ChecklistAmbulance extends sequelize_1.Model {
}
ChecklistAmbulance.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'ambulances', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'CASCADE', // impide eliminar al padre si tiene hijos
    },
    shift_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'shifts', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'CASCADE', // impide eliminar al padre si tiene hijos
    },
    time: { type: sequelize_1.DataTypes.TIME, allowNull: false },
    km: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    gas_path: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    sign_operator_path: { type: sequelize_1.DataTypes.STRING, defaultValue: null, allowNull: true },
    recipient_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    sign_recipient_path: { type: sequelize_1.DataTypes.STRING, defaultValue: null, allowNull: true },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true }
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'ChecklistAmbulance',
    tableName: 'checklist_ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['ambulance_id'] },
        {
            unique: true,
            fields: ['shift_id'],
            name: 'checklist_ambulance_shift_id',
        },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = ChecklistAmbulance;
