"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class SupplyAmbulance extends sequelize_1.Model {
}
SupplyAmbulance.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    avaible_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    area: { type: sequelize_1.DataTypes.STRING, allowNull: true }, //! puede ser nulo?
    order_area: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'ambulances', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    supply_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'supplies', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'SupplyAmbulance',
    tableName: 'supplies_ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['supply_id'] },
        { unique: true, fields: ['area'], name: 'uq_area' },
        { unique: true, fields: ['area', 'order_area'], name: 'uq_area_order' }
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = SupplyAmbulance;
