import { Request } from "express";
import {
  AnswerSupInterface,
  regularExp,
  RequestAnswerSupInterface,
} from "../../infrastructure";
import { ERROR_CODES } from "../../domain";

export class SupAnswersDto {
  static fromRequest(req: Request): [string?, RequestAnswerSupInterface?] {
    const checklistId = String(req.params?.id ?? "").trim();
    if (!checklistId) return [ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];

    const answers = (req.body as any)?.answers;
    if (!Array.isArray(answers) || answers.length === 0) {
      return ["MISSING_ANSWERS"];
    }

    const out: AnswerSupInterface[] = [];
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i] ?? {};

      const supplyId = String(a.supplyId ?? "").trim();
      const requiredQuantity = String(a.requiredQuantity ?? "").trim();

      if (!supplyId) return [ERROR_CODES.MISSING_SUPPLY_ID];
      if (!regularExp.uuid.test(supplyId))
        return [ERROR_CODES.INVALID_SUPPLY_ID];
      if (!requiredQuantity) return [ERROR_CODES.MISSING_REQUIRED_QUANTITY];

      const reqQuaNum =
        typeof requiredQuantity === "number"
          ? requiredQuantity
          : Number(requiredQuantity);
      if (!Number.isFinite(reqQuaNum) || reqQuaNum < 0)
        return [ERROR_CODES.INVALID_REQUIRED_QUANTITY];

      out.push({
        supplyId,
        requiredQuantity: reqQuaNum,
      });
    }

    return [undefined, { checklistId, answers: out }];
  }
}
