import { RequestHandler } from "express";
import { CustomError } from "../../application/errors/custom.error";
import { Role, ROLE_LIST } from "../../domain/enums/user-roles.enum";

export class PermissionMiddleware {
  static allow(...roles: Role[]): RequestHandler {
    const handler: RequestHandler = (req, _res, next) => {
      if (!req.user) return next(CustomError.unauthorized("INVALID_TOKEN_USER"));
      if (!ROLE_LIST.includes(req.user.role) || !roles.includes(req.user.role)) {
        return next(new CustomError(403, "UNAUTHORIZED_RANK"));
      }
      return next();
    };
    return Object.assign(handler, { allowedRoles: roles });
  }
}
