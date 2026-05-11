import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, SuppliesControllerInterface } from "../../domain";
import { SuppliesService } from "../services/supplies.service";
import { SupplyEntityDto } from "../../application/dtos/supply-entity.dto";
import { CustomError, PaginationDto } from "../../application";
import { regularExp } from "../../infrastructure";

export class SuppliesController implements SuppliesControllerInterface {
  constructor(public readonly suppliesService: SuppliesService) {}

  createSupply(req: Request, res: Response, next: NextFunction): void {
    const { id: pharmacyId } = req.params;
    const [error, supplyEntityDto] = SupplyEntityDto.create({
      ...req.body,
      pharmacyId,
    });
    if (error) throw CustomError.badRequest(error);

    this.suppliesService
      .createSupply(supplyEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
  editSupply(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.edit({ id, ...req.body });
    if (error) throw CustomError.badRequest(error);

    this.suppliesService
      .editSupply(supplyEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
  deleteSupply(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const [error, supplyEntityDto] = SupplyEntityDto.id({ id });
    if (error) throw CustomError.badRequest(error);

    this.suppliesService
      .deleteSupply(supplyEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  getSupplies(req: Request, res: Response, next: NextFunction): void {
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

    if (error) throw CustomError.badRequest(error);

    this.suppliesService
      .getSupplies(id, paginationDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }

  getOneSupply(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, supplyEntityDto] = SupplyEntityDto.id({ id });
    if (error) throw CustomError.badRequest(error);

    const { id: supplyId } = supplyEntityDto!;

    this.suppliesService
      .getOneSupply(supplyId!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)));
  }
}
