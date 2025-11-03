"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsService = void 0;
const fs_1 = require("fs");
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
const answer_model_store_1 = __importDefault(require("../../infrastructure/models/store/sequelize/checklist/answer-model.store"));
const answer_component_model_store_1 = __importDefault(require("../../infrastructure/models/store/sequelize/checklist/answer-component-model.store"));
class ChecklistsService {
    //* QUESTIONS
    async getAmbQuestions() {
        const questions = await infrastructure_1.Question.findAll({ order: ['order_category', 'order_question_category'] });
        return {
            success: true,
            data: questions
        };
    }
    async getAmbQuestionPerCategory(category) {
        const questions = await infrastructure_1.Question.findAll({ where: { order_category: category }, order: ['order_question_category'] });
        return {
            success: true,
            data: questions
        };
    }
    //* AMBULANCE CHECKLIST
    async createAmbChecklist(checkListAmbulanceEntityDto) {
        const { ambulanceId, shiftId, km, gasFile, notes } = checkListAmbulanceEntityDto;
        const baseDir = 'uploads/ambulance';
        const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;
        const saved = [];
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const ambulance = await infrastructure_1.Ambulance.findOne({
                where: { id: ambulanceId }
            });
            if (!ambulance)
                throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
            const shift = await infrastructure_1.Shift.findOne({
                where: { id: shiftId }
            });
            if (!shift)
                throw domain_1.ERROR_CODES.SHIFT_NOT_FOUND;
            const gas = await (0, infrastructure_1.saveWebFile)(gasFile, baseDir, subDir);
            saved.push({ absPath: gas.absPath, relPath: gas.relPath });
            const checklist = await infrastructure_1.ChecklistAmbulance.create({
                ambulance_id: ambulanceId,
                shift_id: shiftId,
                time: (0, infrastructure_1.getCurrentTime)(),
                km: Number(km),
                notes: notes ?? undefined,
                gas_path: gas.relPath
            }, { transaction: tx });
            await infrastructure_1.Shift.update({
                checklist_ambulance_id: checklist.id
            }, { where: { id: shiftId }, transaction: tx });
            await tx?.commit();
            return {
                success: true,
                data: checklist
            };
        }
        catch (error) {
            await Promise.allSettled(saved.map(f => fs_1.promises.unlink(f.absPath)));
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.INSERT_FAILED;
        }
    }
    async signAmbChecklist(checkListAmbulanceEntityDto) {
        const { id, signOperatorFile, signRecipientFile } = checkListAmbulanceEntityDto;
        const checklist = await infrastructure_1.ChecklistAmbulance.findOne({ where: { id }, attributes: ['ambulance_id'] });
        if (!checklist)
            throw domain_1.ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
        const { ambulance_id: ambulanceId } = checklist;
        const baseDir = 'uploads/ambulance';
        const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;
        const saved = [];
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const signOp = await (0, infrastructure_1.saveWebFile)(signOperatorFile, baseDir, subDir);
            saved.push({ absPath: signOp.absPath, relPath: signOp.relPath });
            const signRec = await (0, infrastructure_1.saveWebFile)(signRecipientFile, baseDir, subDir);
            saved.push({ absPath: signRec.absPath, relPath: signRec.relPath });
            await infrastructure_1.ChecklistAmbulance.update({
                sign_operator_path: signOp.relPath,
                sign_recipient_path: signRec.relPath
            }, { where: { id }, transaction: tx });
            await tx?.commit();
            return {
                success: true,
                data: {
                    signOperatorPath: signOp.relPath,
                    signRecipientPath: signRec.relPath
                }
            };
        }
        catch (err) {
            await Promise.allSettled(saved.map(f => fs_1.promises.unlink(f.absPath)));
            await tx?.rollback();
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async deleteAmbChecklist(checkListAmbulanceEntityDto) {
        const { id } = checkListAmbulanceEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const checklist = await infrastructure_1.ChecklistAmbulance.findOne({
                where: { id },
                attributes: ['gas_path', 'sign_operator_path', 'sign_recipient_path'],
                transaction: tx
            });
            const saved = [];
            if (checklist?.gas_path)
                saved.push({ absPath: (0, infrastructure_1.relToAbs)(checklist?.gas_path) });
            if (checklist?.sign_operator_path)
                saved.push({ absPath: (0, infrastructure_1.relToAbs)(checklist?.sign_operator_path) });
            if (checklist?.sign_recipient_path)
                saved.push({ absPath: (0, infrastructure_1.relToAbs)(checklist?.sign_recipient_path) });
            await Promise.allSettled(saved.map(f => fs_1.promises.unlink(f.absPath)));
            const row = await infrastructure_1.ChecklistAmbulance.destroy({ where: { id }, transaction: tx });
            if (row === 0)
                throw domain_1.ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
            tx.commit();
            return { success: true };
        }
        catch (error) {
            tx?.rollback();
            throw domain_1.ERROR_CODES.DELETE_FAILED;
        }
    }
    async getAmbChecklist(id) {
        try {
            const checklist = await infrastructure_1.ChecklistAmbulance.findByPk(id, {
                include: {
                    model: answer_model_store_1.default,
                    as: 'answers',
                    attributes: ['id'],
                    include: [
                        {
                            model: infrastructure_1.Question,
                            as: 'question',
                            attributes: [
                                'id',
                                'question',
                                'name_category',
                                'order_category',
                                'order_question_category',
                                'name_subcategory',
                                'order_subcategory',
                                'type_response'
                            ]
                        },
                        {
                            model: answer_component_model_store_1.default,
                            as: 'components',
                            attributes: [
                                'id',
                                'type',
                                'value_bool',
                                'value_option',
                                'value_text'
                            ]
                        },
                    ]
                },
                order: [
                    [
                        { model: answer_model_store_1.default, as: 'answers' },
                        { model: infrastructure_1.Question, as: 'question' },
                        'order_category',
                        'ASC',
                    ],
                    [
                        { model: answer_model_store_1.default, as: 'answers' },
                        { model: infrastructure_1.Question, as: 'question' },
                        'order_question_category',
                        'ASC',
                    ],
                ],
            });
            if (!checklist)
                throw domain_1.ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
            return {
                success: true,
                data: checklist
            };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error; //! TODO: tipificar mejor?
            throw domain_1.ERROR_CODES.UNKNOWN_ERROR;
        }
    }
    async putAmbAnswers(object) {
        const { checklistAmbulanceId, answers } = object;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            for (const ans of answers) {
                const questionId = ans.questionId;
                const [answer] = await answer_model_store_1.default.findOrCreate({
                    where: {
                        checklist_ambulance_id: checklistAmbulanceId,
                        question_id: questionId
                    },
                    defaults: {
                        checklist_ambulance_id: checklistAmbulanceId,
                        question_id: questionId
                    },
                    transaction: tx
                });
                await answer_component_model_store_1.default.create({
                    answer_id: answer.id,
                    type: ans.type,
                    value_bool: ans.valueBool ?? null,
                    value_option: ans.valueOption ?? null,
                    value_text: ans.valueText ?? null
                }, { transaction: tx });
            }
            await tx?.commit();
            return { success: true };
        }
        catch (error) {
            console.log(error);
            await tx?.rollback();
            throw domain_1.ERROR_CODES.INSERT_FAILED;
        }
    }
}
exports.ChecklistsService = ChecklistsService;
