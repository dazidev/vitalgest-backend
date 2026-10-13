import { ERROR_CODES } from "../../../domain";
import { regularExp } from "../../../infrastructure";

type QuestionSubcategoryDtoProps = {
  id?: string;
  categoryId?: string;
  name?: string;
  order?: number;
};

export class QuestionSubcategoryEntityDto {
  readonly id?: string;
  readonly categoryId?: string;
  readonly name?: string;
  readonly order?: number;

  private constructor(props: QuestionSubcategoryDtoProps) {
    Object.assign(this, props);
  }

  static create(object: {
    [key: string]: any;
  }): [string?, QuestionSubcategoryEntityDto?] {
    const { categoryId, name } = object;

    if (!categoryId) return [ERROR_CODES.MISSING_QUESTION_CATEGORY_ID];

    if (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    if (name === undefined)
      return [ERROR_CODES.MISSING_QUESTION_SUBCATEGORY_NAME];

    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      name.trim().length > 150
    )
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_NAME];

    return [
      undefined,
      new QuestionSubcategoryEntityDto({
        categoryId,
        name: name.trim(),
      }),
    ];
  }

  static edit(object: {
    [key: string]: any;
  }): [string?, QuestionSubcategoryEntityDto?] {
    const { id, categoryId, name, order } = object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_SUBCATEGORY_ID];

    if (typeof id !== "string" || !regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID];

    if (categoryId === undefined && name === undefined && order === undefined)
      return [ERROR_CODES.EMPTY_QUESTION_SUBCATEGORY_UPDATE];

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
    )
      return [ERROR_CODES.INVALID_QUESTION_CATEGORY_ID];

    let normalizedName: string | undefined;

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length === 0 ||
        name.trim().length > 150
      )
        return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_NAME];

      normalizedName = name.trim();
    }

    if (order !== undefined && (!Number.isSafeInteger(order) || order < 1))
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ORDER];

    return [
      undefined,
      new QuestionSubcategoryEntityDto({
        id,
        categoryId,
        name: normalizedName,
        order,
      }),
    ];
  }

  static delete(object: {
    [key: string]: any;
  }): [string?, QuestionSubcategoryEntityDto?] {
    const { id } = object;

    if (!id) return [ERROR_CODES.MISSING_QUESTION_SUBCATEGORY_ID];

    if (typeof id !== "string" || !regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID];

    return [undefined, new QuestionSubcategoryEntityDto({ id })];
  }
}
