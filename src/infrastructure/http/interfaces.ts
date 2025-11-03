export type AnswerType = "bool" | "option" | "text" | "bool_option" | "bool_text" | "option_text" | "bool_option_text"

export interface AnswerComponentInterface {
  questionId: string
  type: AnswerType
  valueBool?: boolean
  valueOption?: string
  valueText?: string
}

export interface RequestAnswerInterface {
  checklistAmbulanceId: string
  answers: AnswerComponentInterface[]
}