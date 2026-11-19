import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, ShiftsControllerInterface } from "../../domain";
import { CustomError, PaginationDto, ShiftEntityDto } from "../../application";
import { regularExp } from "../../infrastructure";
import { ShiftsService } from "../services/shifts.service";

export class ShiftsController implements ShiftsControllerInterface {
  constructor(public readonly shiftsService: ShiftsService) {}

  createShift(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, shiftEntityDto] = ShiftEntityDto.create(req.body);

    if (error) throw CustomError.from(error);

    this.shiftsService
      .createShift(req.user!, shiftEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  editShift(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, shiftEntityDto] = ShiftEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.from(error);

    this.shiftsService
      .editShift(req.user!, shiftEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteShift(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, shiftEntityDto] = ShiftEntityDto.delete({ id });

    if (error) throw CustomError.from(error);

    this.shiftsService
      .deleteShift(req.user!, shiftEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getShifts(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    const { limit, offset } = req.query;

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);

    if (!regularExp.uuid.test(id)) {
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);
    }

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (error) throw CustomError.from(error);

    this.shiftsService
      .getShifts(req.user!, id, paginationDto!)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }

  getOneShift(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID);

    this.shiftsService
      .getOneShift(req.user!, id)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }
}
