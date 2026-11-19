import { Request, Response, NextFunction } from "express";

import { QuestionsControllerInterface, ERROR_CODES } from "../../domain";

import {
  CustomError,
  PaginationDto,
  QuestionCategoryEntityDto,
  QuestionEntityDto,
  QuestionSubcategoryEntityDto,
} from "../../application";

import { regularExp } from "../../infrastructure";
import { QuestionsService } from "../services/questions.service";

export class QuestionsController implements QuestionsControllerInterface {
  constructor(public readonly questionsService: QuestionsService) {}

  private handleError = (error: unknown): CustomError => {
    if (error instanceof CustomError) return error;

    if (
      error === ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND ||
      error === ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND ||
      error === ERROR_CODES.QUESTION_NOT_FOUND
    )
      return CustomError.notFound(error);

    if (
      error === ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS ||
      error === ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES ||
      error === ERROR_CODES.QUESTION_CATEGORY_CONFLICT ||
      error === ERROR_CODES.QUESTION_SUBCATEGORY_ALREADY_EXISTS ||
      error === ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS ||
      error === ERROR_CODES.QUESTION_SUBCATEGORY_CONFLICT ||
      error === ERROR_CODES.QUESTION_HAS_ANSWERS ||
      error === ERROR_CODES.QUESTION_CONFLICT
    )
      return new CustomError(409, error);

    if (
      error === ERROR_CODES.UNKNOWN_DB_ERROR ||
      error === ERROR_CODES.UNKNOWN_ERROR
    )
      return CustomError.internalServer(error);

    if (typeof error === "string") return CustomError.from(error);

    return CustomError.internalServer(ERROR_CODES.UNKNOWN_ERROR);
  };

  //* CATEGORIES

  getCategories(req: Request, res: Response, next: NextFunction): void {
    this.questionsService
      .getCategories(req.user!)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  getCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;

    if (!id)
      throw CustomError.badRequest(ERROR_CODES.MISSING_QUESTION_CATEGORY_ID);

    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_CATEGORY_ID);

    this.questionsService
      .getCategory(req.user!, id)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  createCategory(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, categoryDto] = QuestionCategoryEntityDto.create(
      req.body ?? {},
    );

    if (error) throw CustomError.from(error);

    this.questionsService
      .createCategory(req.user!, categoryDto!, userId)
      .then((response) => res.status(201).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  editCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, categoryDto] = QuestionCategoryEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .editCategory(req.user!, categoryDto!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  deleteCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, categoryDto] = QuestionCategoryEntityDto.delete({
      id: req.params.id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .deleteCategory(req.user!, categoryDto!.id!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  //* SUBCATEGORIES

  getSubcategories(req: Request, res: Response, next: NextFunction): void {
    const { categoryId } = req.query;

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
    ) {
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_CATEGORY_ID);
    }

    this.questionsService
      .getSubcategories(req.user!, typeof categoryId === "string" ? categoryId : undefined)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  getSubcategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;

    if (!id)
      throw CustomError.badRequest(ERROR_CODES.MISSING_QUESTION_SUBCATEGORY_ID);

    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID);

    this.questionsService
      .getSubcategory(req.user!, id)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  createSubcategory(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, subcategoryDto] = QuestionSubcategoryEntityDto.create(
      req.body ?? {},
    );

    if (error) throw CustomError.from(error);

    this.questionsService
      .createSubcategory(req.user!, subcategoryDto!, userId)
      .then((response) => res.status(201).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  editSubcategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, subcategoryDto] = QuestionSubcategoryEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .editSubcategory(req.user!, subcategoryDto!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  deleteSubcategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, subcategoryDto] = QuestionSubcategoryEntityDto.delete({
      id: req.params.id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .deleteSubcategory(req.user!, subcategoryDto!.id!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  //* QUESTIONS

  getQuestions(req: Request, res: Response, next: NextFunction): void {
    const { categoryId, subcategoryId, limit, offset } = req.query;

    if (
      categoryId !== undefined &&
      (typeof categoryId !== "string" || !regularExp.uuid.test(categoryId))
    )
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_CATEGORY_ID);

    if (
      subcategoryId !== undefined &&
      (typeof subcategoryId !== "string" ||
        !regularExp.uuid.test(subcategoryId))
    )
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ID);

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .getQuestions(req.user!,
        paginationDto!,
        categoryId as string | undefined,
        subcategoryId as string | undefined,
      )
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  getQuestion(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_QUESTION_ID);

    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_QUESTION_ID);

    this.questionsService
      .getQuestion(req.user!, id)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  createQuestion(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, questionDto] = QuestionEntityDto.create(req.body ?? {});

    if (error) throw CustomError.from(error);

    this.questionsService
      .createQuestion(req.user!, questionDto!, userId)
      .then((response) => res.status(201).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  editQuestion(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, questionDto] = QuestionEntityDto.edit({
      ...(req.body ?? {}),
      id: req.params.id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .editQuestion(req.user!, questionDto!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  deleteQuestion(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, questionDto] = QuestionEntityDto.delete({
      id: req.params.id,
    });

    if (error) throw CustomError.from(error);

    this.questionsService
      .deleteQuestion(req.user!, questionDto!.id!, userId)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }
}
