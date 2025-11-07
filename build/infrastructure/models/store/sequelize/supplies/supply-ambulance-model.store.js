"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class SupplyAmbulance extends sequelize_1.Model {
}
SupplyAmbulance.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    specification: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    avaible_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    min_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    expiration_date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    measurement_unit: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    area_id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'areas_ambulance', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'ambulances', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'SupplyAmbulance',
    tableName: 'supplies_ambulances',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
});
exports.default = SupplyAmbulance;
