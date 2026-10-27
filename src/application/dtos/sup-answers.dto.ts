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
      const reportedQuantity = String(a.reportedQuantity ?? "").trim();

      if (!supplyId) return [ERROR_CODES.MISSING_SUPPLY_ID];
      if (!regularExp.uuid.test(supplyId))
        return [ERROR_CODES.INVALID_SUPPLY_ID];

      if (!reportedQuantity) return [ERROR_CODES.MISSING_REPORTED_QUANTITY];

      const reportedQuantityNum = Number(reportedQuantity);

      if (
        !/^\d+$/.test(reportedQuantity) ||
        !Number.isSafeInteger(reportedQuantityNum)
      )
        return [ERROR_CODES.INVALID_REPORTED_QUANTITY];

      out.push({
        supplyId,
        reportedQuantity: reportedQuantityNum,
      });
    }

    return [undefined, { checklistId, answers: out }];
  }
}
