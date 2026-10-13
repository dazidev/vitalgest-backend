import { ERROR_CODES } from "../../../domain";
import { regularExp } from "../../../infrastructure";

type QuestionCategoryDtoProps = {
  id?: string;
  name?: string;
  order?: number;
};

export class QuestionCategoryEntityDto {
  readonly id?: string;
  readonly name?: string;
  readonly order?: number;

  private constructor(props: QuestionCategoryDtoProps) {
    Object.assign(this, props);
  }

  static create(object: {
    [key: string]: any;
  }): [string?, QuestionCategoryEntityDto?] {
    const { name } = object;

    if (name === undefined) return [ERROR_CODES.MISSING_QUESTION_CATEGORY_NAME];

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      name.trim().length > 150
    ) {
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_NAME];
    }

    return [
      undefined,
      new QuestionCategoryEntityDto({
        name: name.trim(),
      }),
    ];
  }

  static edit(object: {
    [key: string]: any;
  }): [string?, QuestionCategoryEntityDto?] {
    const { id, name, order } = object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_CATEGORY_ID];

    if (!regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    if (name === undefined && order === undefined)
      return [ERROR_CODES.EMPTY_QUESTION_CATEGORY_UPDATE];

    let normalizedName: string | undefined;

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length === 0 ||
        name.trim().length > 150
      ) {
        return [ERROR_CODES.INVALID_QUESTION_CATEGORY_NAME];
      }

      normalizedName = name.trim();
    }

    if (order !== undefined) {
      if (!Number.isSafeInteger(order) || order < 1)
        return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ORDER];
    }

    return [
      undefined,
      new QuestionCategoryEntityDto({
        id,
        name: normalizedName,
        order,
      }),
    ];
  }

  static delete(object: {
    [key: string]: any;
  }): [string?, QuestionCategoryEntityDto?] {
    const { id } = object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_CATEGORY_ID];

    if (!regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    return [undefined, new QuestionCategoryEntityDto({ id })];
  }
}
