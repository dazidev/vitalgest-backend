"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbAnswersDto = void 0;
const domain_1 = require("../../domain");
class AmbAnswersDto {
    static fromRequest(req) {
        const checklistAmbulanceId = String(req.params?.id ?? '').trim();
        if (!checklistAmbulanceId)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_AMBULANCE_ID];
        const answers = req.body?.answers;
        if (!Array.isArray(answers) || answers.length === 0) {
            return ['Body.answers must be a non-empty array'];
        }
        const out = [];
        for (let i = 0; i < answers.length; i++) {
            const a = answers[i] ?? {};
            const questionId = String(a.questionId ?? '').trim();
            const type = a.type;
            if (!questionId)
                return ['MISSING_QUESTION_ID'];
            if (!type)
                return ['MISSING_TYPE'];
            out.push({
                questionId,
                type,
                ...(a.valueBool !== undefined ? { valueBool: !!a.valueBool } : {}),
                ...(a.valueOption !== undefined ? { valueOption: String(a.valueOption) } : {}),
                ...(a.valueText !== undefined ? { valueText: String(a.valueText) } : {}),
            });
        }
        return [undefined, { checklistAmbulanceId, answers: out }];
    }
}
exports.AmbAnswersDto = AmbAnswersDto;
