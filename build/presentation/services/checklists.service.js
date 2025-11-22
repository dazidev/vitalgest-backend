"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsService = void 0;
const fs_1 = require("fs");
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
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
        const { ambulanceId, shiftId, km, /*gasFile,*/ } = checkListAmbulanceEntityDto;
        /*const baseDir = 'uploads/ambulance';
        const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;
    
        const saved: { absPath: string; relPath: string }[] = [];*/
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const ambulance = await infrastructure_1.Ambulance.findOne({
                where: { id: ambulanceId },
                transaction: tx
            });
            if (!ambulance)
                throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
            const shift = await infrastructure_1.Shift.findOne({
                where: { id: shiftId },
                transaction: tx
            });
            if (!shift)
                throw domain_1.ERROR_CODES.SHIFT_NOT_FOUND;
            const exists = await infrastructure_1.ChecklistAmbulance.findOne({
                where: { ambulance_id: ambulanceId, shift_id: shiftId },
                transaction: tx
            });
            if (exists)
                throw domain_1.ERROR_CODES.CHECKLIST_ALREADY_EXISTS;
            /*const gas = await saveWebFile(gasFile!, baseDir, subDir);
            saved.push({ absPath: gas.absPath, relPath: gas.relPath });*/
            const checklist = await infrastructure_1.ChecklistAmbulance.create({
                ambulance_id: ambulanceId,
                shift_id: shiftId,
                time: (0, infrastructure_1.getCurrentTime)(),
                km: Number(km),
                gas_path: 'sin utilizar' /*gas.relPath*/
            }, { transaction: tx });
            await tx?.commit();
            return {
                success: true,
                data: checklist
            };
        }
        catch (error) {
            // await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw error; //! todo: cambiar
        }
    }
    async signAmbChecklist(checkListAmbulanceEntityDto) {
        const { id, /*signOperatorFile, signRecipientFile,*/ recipientId, notes } = checkListAmbulanceEntityDto;
        const checklist = await infrastructure_1.ChecklistAmbulance.findOne({ where: { id }, attributes: ['ambulance_id'] });
        if (!checklist)
            throw domain_1.ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
        /*const { ambulance_id: ambulanceId } = checklist
    
        const baseDir = 'uploads/ambulance';
        const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;
    
        const saved: { absPath: string; relPath: string }[] = [];*/
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            /*const signOp = await saveWebFile(signOperatorFile!, baseDir, subDir);
            saved.push({ absPath: signOp.absPath, relPath: signOp.relPath });
      
            const signRec = await saveWebFile(signRecipientFile!, baseDir, subDir);
            saved.push({ absPath: signRec.absPath, relPath: signRec.relPath });*/
            await infrastructure_1.ChecklistAmbulance.update({
                /*sign_operator_path: signOp.relPath,
                sign_recipient_path: signRec.relPath*/
                recipient_id: recipientId,
                notes: notes ?? undefined,
            }, { where: { id }, transaction: tx });
            await tx?.commit();
            return {
                success: true
            };
        }
        catch (err) {
            // await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
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
                attributes: { exclude: ['ambulance_id', 'shift_id', 'recipient_id'] },
                include: [
                    { model: infrastructure_1.Ambulance, as: 'ambulance', attributes: ['id'] },
                    { model: infrastructure_1.Shift, as: 'shift', attributes: ['id'] },
                    { model: infrastructure_1.User, as: 'recipient', attributes: ['id', 'name', 'lastname'] },
                    {
                        model: infrastructure_1.Answer,
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
                                model: infrastructure_1.AnswerComponent,
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
                ],
                order: [
                    [
                        { model: infrastructure_1.Answer, as: 'answers' },
                        { model: infrastructure_1.Question, as: 'question' },
                        'order_category',
                        'ASC',
                    ],
                    [
                        { model: infrastructure_1.Answer, as: 'answers' },
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
                const [answer] = await infrastructure_1.Answer.findOrCreate({
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
                await infrastructure_1.AnswerComponent.create({
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
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw error;
        }
    }
}
exports.ChecklistsService = ChecklistsService;
