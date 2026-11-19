import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, GuardsControllerInterface } from "../../domain";
import { CustomError, GuardsEntityDto, PaginationDto } from "../../application";
import { GuardsService } from "../services/guards.service";
import { regularExp } from "../../infrastructure";

export class GuardsController implements GuardsControllerInterface {
  constructor(public readonly guardsService: GuardsService) {}

  createGuard(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, guardsEntityDto] = GuardsEntityDto.create(req.body);
    if (error) throw CustomError.from(error);

    this.guardsService
      .createGuard(req.user!, guardsEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  editGuard(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, guardsEntityDto] = GuardsEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.from(error);

    this.guardsService
      .editGuard(req.user!, guardsEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteGuard(
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

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);

    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);

    this.guardsService
      .deleteGuard(req.user!, id, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getGuards(req: Request, res: Response, next: NextFunction): void {
    const { limit, offset } = req.query;

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (error) throw CustomError.from(error);

    this.guardsService
      .getGuards(req.user!, paginationDto!)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }

  getOneGuard(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);

    this.guardsService
      .getOneGuard(req.user!, id)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }
}
