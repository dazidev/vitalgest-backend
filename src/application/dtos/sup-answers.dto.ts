import { Request } from 'express'
import { AnswerSupInterface, RequestAnswerSupInterface } from '../../infrastructure'
import { ERROR_CODES } from '../../domain'

export class SupAnswersDto {
  static fromRequest(req: Request): [string? , RequestAnswerSupInterface?] {
    const checklistId = String(req.params?.id ?? '').trim()
    if (!checklistId) return [ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID]

    const answers = (req.body as any)?.answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return ['MISSING_ANSWERS']
    }

    const out: AnswerSupInterface[] = []
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i] ?? {}
      
      const category = String(a.category ?? '').trim();
      const specification = String(a.specification ?? '').trim();
      const avaibleQuantity = String(a.avaibleQuantity ?? '').trim();
      const minQuantity = String(a.minQuantity ?? '').trim();
      const requiredQuantity = String(a.requiredQuantity ?? '').trim();
      const measurementUnit = String(a.measurementUnit ?? '').trim();
      const areaId = String(a.areaId ?? '').trim();

      if (!category) return [ERROR_CODES.MISSING_CATEGORY]
      if (!avaibleQuantity) return [ERROR_CODES.MISSING_QUANTITY]
      if (!minQuantity) return [ERROR_CODES.MISSING_MIN_QUANTITY]
      if (!requiredQuantity) return [ERROR_CODES.MISSING_REQUIRED_QUANTITY]
      if (!measurementUnit) return [ERROR_CODES.MISSING_MEASUREMENT_UNIT]
      if (!areaId) return [ERROR_CODES.MISSING_AREA_ID]

      const avaQuaNum = typeof avaibleQuantity === "number" ? avaibleQuantity : Number(avaibleQuantity);
      if (!Number.isFinite(avaQuaNum) || avaQuaNum < 0) return [ERROR_CODES.INVALID_AVAIBLE_QUANTITY];

      const minQuaNum = typeof minQuantity === "number" ? minQuantity : Number(minQuantity);
      if (!Number.isFinite(minQuaNum) || minQuaNum < 0) return [ERROR_CODES.INVALID_MIN_QUANTITY];

      const reqQuaNum = typeof requiredQuantity === "number" ? requiredQuantity : Number(requiredQuantity);
      if (!Number.isFinite(reqQuaNum) || reqQuaNum < 0) return [ERROR_CODES.INVALID_REQUIRED_QUANTITY];


      out.push({
        category,
        specification,
        avaibleQuantity: avaQuaNum,
        minQuantity: minQuaNum,
        requiredQuantity: reqQuaNum,
        measurementUnit,
        areaId
      })
    }

    return [undefined, { checklistId, answers: out }]
  }
}
