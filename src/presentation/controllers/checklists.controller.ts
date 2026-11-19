import { Request, Response, NextFunction } from "express";
import { CheckListsControllerInterface, ERROR_CODES } from "../../domain";
import { ChecklistsService } from "../services/checklists.service";
import { CheckListSupplyEntityDto } from "../../application/dtos/checklist-supply-entity.dto";
import {
  AmbAnswersDto,
  CheckListAmbulanceEntityDto,
  CustomError,
  SupAnswersDto,
} from "../../application";

export class ChecklistsController implements CheckListsControllerInterface {
  constructor(public readonly checklistsService: ChecklistsService) {}

  createSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.create(
      req.body,
    );

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .createSupChecklist(req.user!, checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  signSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.sign({
      ...req.body,
      id,
    });

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .signSupChecklist(req.user!, checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.delete({
      id,
    });

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .deleteSupChecklist(req.user!, checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.delete({
      id,
    });
    if (error) throw CustomError.from(error);

    const { id: idv } = checkListSupplyEntityDto!;

    this.checklistsService
      .getSupChecklist(req.user!, idv!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  putSupAnswers(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, dto] = SupAnswersDto.fromRequest(req);

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .putSupAnswers(req.user!, dto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getAmbQuestions(req: Request, res: Response, next: NextFunction): void {
    const categoryStr = req.query.category;

    if (categoryStr !== undefined) {
      const catNorm = String(categoryStr).trim();
      if (!/^\d+$/.test(catNorm))
        return next(CustomError.badRequest(ERROR_CODES.INVALID_CATEGORY));

      const category = Number(catNorm);

      if (!Number.isSafeInteger(category) || category < 1)
        return next(CustomError.badRequest(ERROR_CODES.INVALID_CATEGORY));

      this.checklistsService
        .getAmbQuestionPerCategory(req.user!, category)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.from(err)));
      return;
    }
    this.checklistsService
      .getAmbQuestions(req.user!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  createAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.create(req.body);

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .createAmbChecklist(req.user!, checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  signAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.sign({
        ...req.body,
        id,
      });

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .signAmbChecklist(req.user!, checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.delete({ id });

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .deleteAmbChecklist(req.user!, checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.delete({ id });
    if (error) throw CustomError.from(error);

    const { id: idv } = checkListAmbulanceEntityDto!;

    this.checklistsService
      .getAmbChecklist(req.user!, idv!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  putAmbAnswers(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, dto] = AmbAnswersDto.fromRequest(req);

    if (error) {
      next(CustomError.from(error));
      return;
    }

    this.checklistsService
      .putAmbAnswers(req.user!, dto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }
}
