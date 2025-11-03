import { Request } from 'express'
import { AnswerComponentInterface, AnswerType, RequestAnswerInterface } from '../../infrastructure'
import { ERROR_CODES } from '../../domain'

export class AmbAnswersDto {
  static fromRequest(req: Request): [string? , RequestAnswerInterface?] {
    const checklistAmbulanceId = String(req.params?.id ?? '').trim()
    if (!checklistAmbulanceId) return [ERROR_CODES.MISSING_CHECKLIST_AMBULANCE_ID]

    const answers = (req.body as any)?.answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return ['Body.answers must be a non-empty array']
    }

    const out: AnswerComponentInterface[] = []
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i] ?? {}
      const questionId = String(a.questionId ?? '').trim()
      const type = a.type as AnswerType | undefined

      if (!questionId) return ['MISSING_QUESTION_ID']
      if (!type)       return ['MISSING_TYPE']

      out.push({
        questionId,
        type,
        ...(a.valueBool !== undefined ? { valueBool: !!a.valueBool } : {}),
        ...(a.valueOption !== undefined ? { valueOption: String(a.valueOption) } : {}),
        ...(a.valueText !== undefined ? { valueText: String(a.valueText) } : {}),
      })
    }

    return [undefined, { checklistAmbulanceId, answers: out }]
  }
}
