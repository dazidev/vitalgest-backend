"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
class State extends sequelize_1.Model {
}
State.init({
    id: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'State',
    tableName: 'states',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
});
exports.default = State;
