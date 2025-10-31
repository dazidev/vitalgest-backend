"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_adapter_1 = require("../../../../config/sequelize.adapter");
class Answer extends sequelize_1.Model {
}
Answer.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.UUIDV4, allowNull: false },
    checklist_ambulance_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'checklist_ambulances', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    question_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: 'questions', key: 'id' },
        onUpdate: 'CASCADE', // actualiza si el padre cambia de id
        onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
}, {
    sequelize: sequelize_adapter_1.sequelize,
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['checklist_ambulance_id'] },
        { fields: ['question_id'] },
        { unique: true, fields: ['checklist_ambulance_id', 'question_id'], name: 'uq_question_response' },
    ],
});
exports.default = Answer;
