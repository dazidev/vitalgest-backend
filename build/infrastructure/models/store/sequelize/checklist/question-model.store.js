"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
// const RESPONSE_STATES = ['BUENO','REGULAR','MALO'] as const;
const TYPE_RESPONSES = [
    "bool",
    "option",
    "text",
    "bool_option",
    "bool_text",
    "option_text",
    "bool_option_text",
];
class Question extends sequelize_1.Model {
}
Question.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
    },
    question: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    name_category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    order_category: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    order_question_category: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name_subcategory: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    order_subcategory: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
    },
    type_response: {
        type: sequelize_1.DataTypes.ENUM(...TYPE_RESPONSES),
        allowNull: false,
    },
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
    underscored: true,
});
exports.default = Question;
