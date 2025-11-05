"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class Supply extends sequelize_1.Model {
}
Supply.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    specification: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    measurement_unit: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    min_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    avaible_quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    expiration_date: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    pharmacy_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'pharmacies', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Supply',
    tableName: 'supplies',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['pharmacy_id'] },
    ],
    // paranoid: true //* activa borrado lógico
});
exports.default = Supply;
