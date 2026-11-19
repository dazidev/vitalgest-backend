import { Request, Response, NextFunction } from "express";
import { AmbulancesControllerInterface, ERROR_CODES } from "../../domain";
import {
  CustomError,
  AmbulanceEntityDto,
  SupplyAmbEntityDto,
  PaginationDto,
} from "../../application";
import { regularExp } from "../../infrastructure";
import { AmbulancesService } from "../services/ambulance.service";

export class AmbulancesController implements AmbulancesControllerInterface {
  constructor(public readonly ambulancesService: AmbulancesService) {}

  getAreas(_req: Request, res: Response, next: NextFunction): void {
    this.ambulancesService
      .getAreas()
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  createAmbulance(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const [error, ambulanceEntityDto] = AmbulanceEntityDto.create(req.body);
    if (error) throw CustomError.from(error);

    this.ambulancesService
      .createAmbulance(req.user!, ambulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  editAmbulance(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, ambulanceEntityDto] = AmbulanceEntityDto.edit({
      id,
      ...req.body,
    });

    if (error) throw CustomError.from(error);

    this.ambulancesService
      .editAmbulance(req.user!, ambulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  deleteAmbulance(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id } = req.params;

    const [error, ambulanceEntityDto] = AmbulanceEntityDto.delete({ id });
    if (error) throw CustomError.from(error);

    this.ambulancesService
      .deleteAmbulance(req.user!, ambulanceEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getAmbulances(req: Request, res: Response, next: NextFunction): void {
    const { limit, offset } = req.query;

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
    });
    if (error) throw CustomError.from(error);

    this.ambulancesService
      .getAmbulances(req.user!, paginationDto!)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }

  getOneAmbulance(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_AMBULANCE_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_AMBULANCE_ID);

    this.ambulancesService
      .getOneAmbulance(req.user!, id)
      .then((response) => res.json(response))
      .catch((error) => next(CustomError.from(error)));
  }

  //* SUPPLIES

  addSupply(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user?.id;

    if (!userId) {
      next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN_USER));
      return;
    }

    const { id: ambulanceId } = req.params;

    const [error, supplyAmbEntityDto] = SupplyAmbEntityDto.create({
      ...req.body,
      ambulanceId,
    });

    if (error) throw CustomError.from(error);

    this.ambulancesService
      .addSupply(req.user!, supplyAmbEntityDto!, userId)
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

    const [error, supplyAmbEntityDto] = SupplyAmbEntityDto.edit({
      id,
      ...req.body,
    });

    if (error) throw CustomError.from(error);

    this.ambulancesService
      .editSupply(req.user!, supplyAmbEntityDto!, userId)
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

    const [error, supplyAmbEntityDto] = SupplyAmbEntityDto.id({ id });

    if (error) throw CustomError.from(error);

    this.ambulancesService
      .deleteSupply(req.user!, supplyAmbEntityDto!, userId)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getAmbSupplies(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): void {
    const { id } = req.params;
    const { limit, offset } = req.query;

    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_AMBULANCE_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_AMBULANCE_ID);

    const [error, paginationDto] = PaginationDto.validate({ limit, offset });
    if (error) throw CustomError.from(error);

    this.ambulancesService
      .getAmbSupplies(req.user!, id, paginationDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }

  getOneAmbSupply(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    const [error, supplyAmbEntityDto] = SupplyAmbEntityDto.id({ id });
    if (error) throw CustomError.from(error);

    this.ambulancesService
      .getOneAmbSupply(req.user!, supplyAmbEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.from(err)));
  }
}
