"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class User extends sequelize_1.Model {
}
User.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    status: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    position: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    delegation_id: { type: sequelize_1.DataTypes.UUID, allowNull: false }, //todo: realizar la referencia
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
});
exports.default = User;
