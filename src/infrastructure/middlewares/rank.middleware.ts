import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "../../application";
import { ERROR_CODES, Role, ROLE_LIST, ROLE_RANK } from "../../domain";


export class RankMiddleware {
  static validate(rolRequired: Role): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
      const userRole: Role = req.user!.rol;
      if (!ROLE_LIST.includes(userRole)) return next(CustomError.badRequest(ERROR_CODES.INVALID_ROLE));
      if (!(ROLE_RANK[userRole] >= ROLE_RANK[rolRequired])) return next(CustomError.unauthorized(ERROR_CODES.UNAUTHORIZED_RANK));

      next();
    }
  }
}