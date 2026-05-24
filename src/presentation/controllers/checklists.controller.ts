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
    try {
      const { shiftId } = req.body;

      const payload = {
        shiftId,
      };

      const [error, checkListSupplyEntityDto] =
        CheckListSupplyEntityDto.create(payload);
      if (error) throw next(CustomError.badRequest(error));

      this.checklistsService
        .createSupChecklist(checkListSupplyEntityDto!)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)));
    } catch (error) {
      if (typeof error === "string") return next(CustomError.badRequest(error));
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR));
    }
  }

  signSupChecklist(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const { recipientId, delivererId, notes } = req.body;

      const payload = {
        id,
        recipientId,
        delivererId,
        notes,
      };

      const [error, checkListSupplyEntityDto] =
        CheckListSupplyEntityDto.sign(payload);
      if (error) return next(CustomError.badRequest(error));

      this.checklistsService
        .signSupChecklist(checkListSupplyEntityDto!)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)));
    } catch (error) {
      if (typeof error === "string") return next(CustomError.badRequest(error));
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR));
    }
  }

  deleteSupChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListSupplyEntityDto] = CheckListSupplyEntityDto.delete({
      id,
    });
    if (error) throw CustomError.badRequest(error);

    this.checklistsService
      .deleteSupChecklist(checkListSupplyEntityDto!)
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
    const [error, dto] = SupAnswersDto.fromRequest(req);
    if (error) return next(CustomError.badRequest(error));

    this.checklistsService
      .putSupAnswers(dto!)
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

      //! todo: si se van a implementar mas categorias esto debe ser diferente
      if (category < 1 || category > 9)
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
    try {
      const { ambulanceId, shiftId, km } = req.body;

      const payload = {
        ambulanceId,
        shiftId,
        km,
      };

      const [error, checkListAmbulanceEntityDto] =
        CheckListAmbulanceEntityDto.create(payload);
      if (error) throw next(CustomError.badRequest(error));

      this.checklistsService
        .createAmbChecklist(checkListAmbulanceEntityDto!)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)));
    } catch (error) {
      if (typeof error === "string") return next(CustomError.badRequest(error));
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR));
    }
  }

  signAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const { recipientId, delivererId, notes } = req.body;

      const payload = {
        id,
        recipientId,
        delivererId,
        notes,
      };

      const [error, checkListAmbulanceEntityDto] =
        CheckListAmbulanceEntityDto.sign(payload);
      if (error) return next(CustomError.badRequest(error));

      this.checklistsService
        .signAmbChecklist(checkListAmbulanceEntityDto!)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)));
    } catch (error) {
      if (typeof error === "string") return next(CustomError.badRequest(error));
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR));
    }
  }

  deleteAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, checkListAmbulanceEntityDto] =
      CheckListAmbulanceEntityDto.delete({ id });
    if (error) throw CustomError.badRequest(error);

    this.checklistsService
      .deleteAmbChecklist(checkListAmbulanceEntityDto!)
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
    const [error, dto] = AmbAnswersDto.fromRequest(req);
    if (error) return next(CustomError.badRequest(error));

    this.checklistsService
      .putAmbAnswers(dto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
}
