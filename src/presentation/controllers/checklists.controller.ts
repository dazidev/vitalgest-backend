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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .createSupChecklist(checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .signSupChecklist(checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .deleteSupChecklist(checkListSupplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  getSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.delete({
      id,
    });
    if (error) throw CustomError.badRequest(error);

    const { id: idv } = checkListSupplyEntityDto!;

    this.checklistsService
      .getSupChecklist(idv!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  putSupAnswers(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, dto] = SupAnswersDto.fromRequest(req);

    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .putSupAnswers(dto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
        .getAmbQuestionPerCategory(category)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)));
      return;
    }
    this.checklistsService
      .getAmbQuestions()
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .createAmbChecklist(checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .signAmbChecklist(checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
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
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .deleteAmbChecklist(checkListAmbulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  getAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.delete({ id });
    if (error) throw CustomError.badRequest(error);

    const { id: idv } = checkListAmbulanceEntityDto!;

    this.checklistsService
      .getAmbChecklist(idv!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  putAmbAnswers(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, dto] = AmbAnswersDto.fromRequest(req);

    if (error) {
      next(CustomError.badRequest(error));
      return;
    }

    this.checklistsService
      .putAmbAnswers(dto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
}
