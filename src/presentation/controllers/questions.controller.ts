import { Request, Response, NextFunction } from "express";

import { QuestionsControllerInterface, ERROR_CODES } from "../../domain";

import { CustomError, QuestionCategoryEntityDto } from "../../application";

import { regularExp } from "../../infrastructure";
import { QuestionsService } from "../services/questions.service";

export class QuestionsController implements QuestionsControllerInterface {
  constructor(public readonly questionsService: QuestionsService) {}

  private handleError = (error: unknown): CustomError => {
    if (error instanceof CustomError) return error;

    if (error === ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND)
      return CustomError.notFound(ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND);

    if (
      error === ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS ||
      error === ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES ||
      error === ERROR_CODES.QUESTION_CATEGORY_CONFLICT
    ) {
      return new CustomError(409, error);
    }

    if (
      error === ERROR_CODES.UNKNOWN_DB_ERROR ||
      error === ERROR_CODES.UNKNOWN_ERROR
    ) {
      return CustomError.internalServer(error);
    }

    if (typeof error === "string") return CustomError.badRequest(error);

    return CustomError.internalServer(ERROR_CODES.UNKNOWN_ERROR);
  };

  //* CATEGORIES

  getCategories(_req: Request, res: Response, next: NextFunction): void {
    this.questionsService
      .getCategories()
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
      .getCategory(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  createCategory(req: Request, res: Response, next: NextFunction): void {
    const [error, categoryDto] = QuestionCategoryEntityDto.create(
      req.body ?? {},
    );

    if (error) throw CustomError.badRequest(error);

    this.questionsService
      .createCategory(categoryDto!)
      .then((response) => res.status(201).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  editCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;

    const [error, categoryDto] = QuestionCategoryEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.badRequest(error);

    this.questionsService
      .editCategory(categoryDto!)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }

  deleteCategory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const [error, categoryDto] = QuestionCategoryEntityDto.delete({
      id: req.params.id,
    });

    if (error) throw CustomError.badRequest(error);

    this.questionsService
      .deleteCategory(categoryDto!.id!)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }
}
