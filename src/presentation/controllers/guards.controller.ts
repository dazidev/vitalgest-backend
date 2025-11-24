import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, GuardsControllerInterface } from "../../domain";
import { CustomError, GuardsEntityDto } from "../../application";
import { GuardsService } from "../services/guards.service";
import { regularExp } from "../../infrastructure";

export class GuardsController implements GuardsControllerInterface {
  constructor(public readonly guardsService: GuardsService) {}

  createGuard(req: Request, res: Response, next: NextFunction): void {
    const [error, guardsEntityDto] = GuardsEntityDto.create(req.body);
    if (error) throw CustomError.badRequest(error);

    this.guardsService
      .createGuard(guardsEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
  editGuard(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const [error, guardsEntityDto] = GuardsEntityDto.edit({ id, ...req.body });
    if (error) throw CustomError.badRequest(error);

    this.guardsService
      .editGuard(guardsEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
  deleteGuard(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);

    this.guardsService
      .deleteGuard(id)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  getGuards(req: Request, res: Response, next: NextFunction): void {
    const { amount } = req.params;
    if (!amount) throw CustomError.badRequest(ERROR_CODES.MISSING_AMOUNT);

    this.guardsService
      .getGuards(amount)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  }

  getOneGuard(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);

    this.guardsService
      .getOneGuard(id)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  }
}
