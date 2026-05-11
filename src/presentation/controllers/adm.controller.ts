import { Request, Response, NextFunction } from "express";
import { AdmControllerInterface, ERROR_CODES } from "../../domain";
import { AdmService } from "../services/adm.service";
import { CustomError, PaginationDto, UserEntityDto } from "../../application";
import { regularExp } from "../../infrastructure";

export class AdmController implements AdmControllerInterface {
  constructor(public readonly admService: AdmService) {}

  private handleError = (error: string) => {
    if (error === ERROR_CODES.UNKNOWN_ERROR)
      return CustomError.internalServer(error);
    if (error === ERROR_CODES.UNKNOWN_DB_ERROR)
      return CustomError.internalServer(error);
    if (error === ERROR_CODES.TOO_MANY_REQUESTS)
      return CustomError.tooManyRequests(error);
    return CustomError.badRequest(error);
  };

  createUser(req: Request, res: Response, next: NextFunction): void {
    const [error, userEntityDto] = UserEntityDto.create(req.body);
    if (error) throw CustomError.badRequest(error);

    this.admService
      .createUser(userEntityDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  editUser(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const [error, userEntityDto] = UserEntityDto.edit({ id, ...req.body });
    if (error) throw CustomError.badRequest(error);

    this.admService
      .editUser(userEntityDto!)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  deleteUser(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_USER_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_USER_ID);

    this.admService
      .deleteUser(id!)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  getAllUsers(req: Request, res: Response, next: NextFunction): void {
    const { limit, offset, role } = req.query;

    const [error, paginationDto] = PaginationDto.validate({
      limit,
      offset,
      role,
    });
    if (error) throw CustomError.badRequest(error);

    this.admService
      .getAllUsers(paginationDto!)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  changePasswordUser(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { password } = req.body;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_USER_ID);
    if (!password) throw CustomError.badRequest(ERROR_CODES.MISSING_PASSWORD);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_USER_ID);
    if (!regularExp.password.test(password))
      throw CustomError.badRequest(ERROR_CODES.INVALID_PASSWORD_FORMAT);

    this.admService
      .changePasswordUser(id!, password!)
      .then((user) => res.status(200).json(user))
      .catch((error) => next(this.handleError(error)));
  }

  getUserById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_USER_ID);
    if (!regularExp.uuid.test(id))
      throw CustomError.badRequest(ERROR_CODES.INVALID_USER_ID);

    this.admService
      .getUserById(id!)
      .then((response) => res.status(200).json(response))
      .catch((error) => next(this.handleError(error)));
  }
}
