import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  PaginationDto,
  SupplyReportEntityDto,
} from "../../application";
import { SupplyReportsService } from "../services/supply-reports.service";
import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

export class SupplyReportsController {
  constructor(public readonly supplyReportsService: SupplyReportsService) {}

  getReports(req: Request, res: Response, next: NextFunction): void {
    const { limit, offset } = req.query;

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });

    if (error) throw CustomError.badRequest(error);

    this.supplyReportsService
      .getReports(paginationDto!)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  }

  updateSupplies(req: Request, res: Response, next: NextFunction): void {
    const [error, supplyReportEntityDto] =
      SupplyReportEntityDto.updateSupplies(req);

    if (error) throw CustomError.badRequest(error);

    this.supplyReportsService
      .updateSupplies(supplyReportEntityDto!)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  }

  attendReport(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_SUPPLY_REPORT_ID);

    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_SUPPLY_REPORT_ID);

    this.supplyReportsService
      .attendReport(id)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.badRequest(error)));
  }
}
