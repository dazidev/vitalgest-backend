"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
const ANSWER_TYPES = ["bool", "option", "text", "bool_option", "bool_text", "option_text", "bool_option_text"];
class AnswerComponent extends sequelize_1.Model {
}
AnswerComponent.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    answer_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'answers', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...ANSWER_TYPES),
        allowNull: false,
    },
    value_bool: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
    },
    value_option: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    value_text: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'AnswerComponent',
    tableName: 'answer_component',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['answer_id'] },
        { unique: true, fields: ['answer_id', 'type'], name: 'uq_answer_type_once' },
    ],
});
exports.default = AnswerComponent;
