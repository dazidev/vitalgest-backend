"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsService = void 0;
const infrastructure_1 = require("../../infrastructure");
class ChecklistsService {
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
}
exports.ChecklistsService = ChecklistsService;
