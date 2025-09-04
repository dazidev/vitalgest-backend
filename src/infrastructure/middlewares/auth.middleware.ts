import { Request, Response, NextFunction } from "express"
import { CustomError } from "../../application"
import { JwtAdapter } from "../config/jwt.adapter"
import { ERROR_CODES, UserEntity, UserRepoResponse } from "../../domain"
import { AuthRepositorie } from "../repositories/auth.repositorie"

export class AuthMiddleware {
  static async validateJWT (req: Request, _res: Response, next: NextFunction) {
    const authorization = req.header('Authorization')
    if (!authorization) return next(CustomError.unauthorized(ERROR_CODES.NO_TOKEN_PROVIDED))
    if (!authorization.startsWith('Bearer ')) return next(CustomError.unauthorized(ERROR_CODES.INVALID_BEARER_TOKEN))

    const token = authorization.split(' ').at(1) || ''
    try {
      const result = await JwtAdapter.validateAccessToken<{ id: string }>(token)
      if (!result.success) {
        if (result.reason === 'expired') return next(CustomError.unauthorized(ERROR_CODES.TOKEN_EXPIRED))
        return next(CustomError.unauthorized(ERROR_CODES.INVALID_TOKEN))
      } 

      const authRepo = new AuthRepositorie()

      const response = await authRepo.getUser(undefined, result.payload.id)

      if (!response.success) return next(CustomError.badRequest(ERROR_CODES.INVALID_TOKEN_USER)) // NOTE: manejar despues este error

      // TODO: VALIDAR SI EL USUARIO ESTA ACTIVO

      const user: UserRepoResponse = response.data as UserRepoResponse;

      const {password, createdAt, ...userEntity} = UserEntity.fromObject(user);

      if (Object.prototype.hasOwnProperty.call(req, 'user')) {
        Reflect.deleteProperty(req as any, 'user');
      }

      Object.defineProperty(req, 'user', {
        value: userEntity,
        writable: false,
        enumerable: false,
        configurable: false,
      });

      return next();

    } catch (error) {
      console.log(error)
      return next(CustomError.internalServer('VALIDATE_TOKEN_ERROR'))
    }
  }
}