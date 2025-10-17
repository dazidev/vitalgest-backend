import { Request, Response, NextFunction } from "express"
import { CustomError } from "../../application"
import { JwtAdapter } from "../config/jwt.adapter"
import { ERROR_CODES, UserEntity } from "../../domain"
import { User } from "../models"

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

      const user = await User.findOne({ where: { id: result.payload.id }, attributes: { exclude: ['password'] } })
      if (!user) return next(CustomError.badRequest(ERROR_CODES.INVALID_TOKEN_USER))
      if (user.status === false) return next(CustomError.badRequest(ERROR_CODES.USER_NOT_ACTIVE))

      const userEntity = UserEntity.payloadToken(user);

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