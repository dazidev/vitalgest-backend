import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "../../application";
import { ERROR_CODES, Role, ROLE_LIST, ROLE_RANK } from "../../domain";

export class RankMiddleware {
  static validate(rolRequired: Role, exception = false): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
      const userRole: Role = req.user!.role;
      if (!ROLE_LIST.includes(userRole))
        return next(CustomError.badRequest(ERROR_CODES.INVALID_ROLE));

      if (exception === true) {
        //* exepciones
        const { role } = req.query;
        if (role) {
          if (!(ROLE_RANK[userRole] >= ROLE_RANK["head_guard"]))
            return next(
              CustomError.unauthorized(ERROR_CODES.UNAUTHORIZED_RANK)
            );
          next();
        }
      }

      if (!(ROLE_RANK[userRole] >= ROLE_RANK[rolRequired]))
        return next(CustomError.unauthorized(ERROR_CODES.UNAUTHORIZED_RANK));
      next();
    };
  }
}
