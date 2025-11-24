"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupAnswersDto = void 0;
const infrastructure_1 = require("../../infrastructure");
const domain_1 = require("../../domain");
class SupAnswersDto {
    static fromRequest(req) {
        const checklistId = String(req.params?.id ?? "").trim();
        if (!checklistId)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
        const answers = req.body?.answers;
        if (!Array.isArray(answers) || answers.length === 0) {
            return ["MISSING_ANSWERS"];
        }
        const out = [];
        for (let i = 0; i < answers.length; i++) {
            const a = answers[i] ?? {};
            const supplyId = String(a.supplyId ?? "").trim();
            const requiredQuantity = String(a.requiredQuantity ?? "").trim();
            if (!supplyId)
                return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
            if (!infrastructure_1.regularExp.uuid.test(supplyId))
                return [domain_1.ERROR_CODES.INVALID_SUPPLY_ID];
            if (!requiredQuantity)
                return [domain_1.ERROR_CODES.MISSING_REQUIRED_QUANTITY];
            const reqQuaNum = typeof requiredQuantity === "number"
                ? requiredQuantity
                : Number(requiredQuantity);
            if (!Number.isFinite(reqQuaNum) || reqQuaNum < 0)
                return [domain_1.ERROR_CODES.INVALID_REQUIRED_QUANTITY];
            out.push({
                supplyId,
                requiredQuantity: reqQuaNum,
            });
        }
        return [undefined, { checklistId, answers: out }];
    }
}
exports.SupAnswersDto = SupAnswersDto;
