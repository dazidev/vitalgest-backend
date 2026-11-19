import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, SuppliesControllerInterface } from "../../domain";
import { SuppliesService } from "../services/supplies.service";
import { SupplyEntityDto } from "../../application/dtos/supply-entity.dto";
import { CustomError, PaginationDto } from "../../application";
import { regularExp } from "../../infrastructure";

export class SuppliesController implements SuppliesControllerInterface {
  constructor(public readonly suppliesService: SuppliesService) {}

  createSupply(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id: pharmacyId } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.create({
      ...req.body,
      pharmacyId,
    });

    if (error) throw CustomError.from(error);

    this.suppliesService
      .createSupply(req.user!, supplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  editSupply(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.edit({
      ...req.body,
      id,
    });

    if (error) throw CustomError.from(error);

    this.suppliesService
      .editSupply(req.user!, supplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteSupply(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.id({ id });

    if (error) throw CustomError.from(error);

    this.suppliesService
      .deleteSupply(req.user!, supplyEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getSupplies(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    const { limit, offset } = req.query;

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_PHARMACY);

    if (!regularExp.uuid.test(id)) {
      throw CustomError.badRequest(ERROR_CODES.INVALID_PHARMACY);
    }

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (error) throw CustomError.from(error);

    this.suppliesService
      .getSupplies(req.user!, id, paginationDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getOneSupply(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.id({ id });
    if (error) throw CustomError.from(error);

    const { id: supplyId } = supplyEntityDto!;

    this.suppliesService
      .getOneSupply(req.user!, supplyId!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }
}
