import { ERROR_CODES } from "../../../domain";
import { regularExp } from "../../../infrastructure";

export const QUESTION_RESPONSE_TYPES = [
  "bool",
  "option",
  "text",
  "bool_option",
  "bool_text",
  "option_text",
  "bool_option_text",
] as const;

export type QuestionResponseType = (typeof QUESTION_RESPONSE_TYPES)[number];

type QuestionDtoProps = {
  id?: string;
  question?: string;
  categoryId?: string;
  subcategoryId?: string | null;
  typeResponse?: QuestionResponseType;
  order?: number;
};

export class QuestionEntityDto {
  readonly id?: string;
  readonly question?: string;
  readonly categoryId?: string;
  readonly subcategoryId?: string | null;
  readonly typeResponse?: QuestionResponseType;
  readonly order?: number;

  private constructor(props: QuestionDtoProps) {
    Object.assign(this, props);
  }

  static create(object: { [key: string]: any }): [string?, QuestionEntityDto?] {
    const { question, categoryId, subcategoryId, typeResponse } = object;

    if (question === undefined) return [ERROR_CODES.MISSING_QUESTION_TEXT];

    if (
      typeof question !== "string" ||
      question.trim().length === 0 ||
      question.trim().length > 255
    )
      return [ERROR_CODES.INVALID_QUESTION_TEXT];

    if (!categoryId) return [ERROR_CODES.MISSING_QUESTION_CATEGORY_ID];

    if (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    if (
      subcategoryId !== undefined &&
      subcategoryId !== null &&
      (typeof subcategoryId !== "string" ||
        !regularExp.uuid.test(subcategoryId))
    )
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID];

    if (typeResponse === undefined) return [ERROR_CODES.MISSING_QUESTION_TYPE];

    if (
      typeof typeResponse !== "string" ||
      !QUESTION_RESPONSE_TYPES.includes(typeResponse as QuestionResponseType)
    )
      return [ERROR_CODES.INVALID_QUESTION_TYPE];

    return [
      undefined,
      new QuestionEntityDto({
        question: question.trim(),
        categoryId,
        subcategoryId: subcategoryId ?? null,
        typeResponse: typeResponse as QuestionResponseType,
      }),
    ];
  }

  static edit(object: { [key: string]: any }): [string?, QuestionEntityDto?] {
    const { id, question, categoryId, subcategoryId, typeResponse, order } =
      object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_ID];

    if (typeof id !== "string" || !regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_ID];

    if (
      question === undefined &&
      categoryId === undefined &&
      subcategoryId === undefined &&
      typeResponse === undefined &&
      order === undefined
    )
      return [ERROR_CODES.EMPTY_QUESTION_UPDATE];

    let normalizedQuestion: string | undefined;

    if (question !== undefined) {
      if (
        typeof question !== "string" ||
        question.trim().length === 0 ||
        question.trim().length > 255
      )
        return [ERROR_CODES.INVALID_QUESTION_TEXT];

      normalizedQuestion = question.trim();
    }

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
    )
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    if (
      subcategoryId !== undefined &&
      subcategoryId !== null &&
      (typeof subcategoryId !== "string" ||
        !regularExp.uuid.test(subcategoryId))
    )
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID];

    if (
      typeResponse !== undefined &&
      (typeof typeResponse !== "string" ||
        !QUESTION_RESPONSE_TYPES.includes(typeResponse as QuestionResponseType))
    )
      return [ERROR_CODES.INVALID_QUESTION_TYPE];

    if (order !== undefined && (!Number.isSafeInteger(order) || order < 1))
      return [ERROR_CODES.INVALID_QUESTION_ORDER];

    return [
      undefined,
      new QuestionEntityDto({
        id,
        question: normalizedQuestion,
        categoryId,
        subcategoryId,
        typeResponse,
        order,
      }),
    ];
  }

  static delete(object: { [key: string]: any }): [string?, QuestionEntityDto?] {
    const { id } = object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_ID];

    if (typeof id !== "string" || !regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_ID];

    return [undefined, new QuestionEntityDto({ id })];
  }
}
