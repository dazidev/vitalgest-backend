import { Request, Response, NextFunction } from "express";
import { AdmControllerInterface, ERROR_CODES } from "../../domain";
import { AdmService } from "../services/adm.service";
import { CreateUserDto, CustomError } from "../../application";


export class AdmController implements AdmControllerInterface {

  constructor (
    public readonly admService: AdmService,
  ) {}

  private handleError = (error: {code: string}) => {
    if (error.code === ERROR_CODES.UNKNOWN_ERROR) return CustomError.internalServer(error.code)
    if (error.code === ERROR_CODES.TOO_MANY_REQUESTS) return CustomError.tooManyRequests(error.code)
    return CustomError.badRequest(error.code)
  }

  createUser(req: Request, res: Response, next: NextFunction): void {
    const [error, createUserDto] = CreateUserDto.create(req.body);
    if (error) throw CustomError.badRequest(error);

    this.admService.createUser(createUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => next(this.handleError(error)))
  }

  editUser(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }

  deleteUser(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }

  getAllUsers(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
}