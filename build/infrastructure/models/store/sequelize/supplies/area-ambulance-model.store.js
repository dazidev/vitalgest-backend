"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class AreaAmbulance extends sequelize_1.Model {
}
AreaAmbulance.init({
    id: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    section: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    order: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'AreaAmbulance',
    tableName: 'areas_ambulance',
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['order'] },
    ]
    // paranoid: true //* activa borrado lógico
});
exports.default = AreaAmbulance;
