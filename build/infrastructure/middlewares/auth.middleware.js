"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const application_1 = require("../../application");
const jwt_adapter_1 = require("../config/jwt.adapter");
const domain_1 = require("../../domain");
const models_1 = require("../models");
class AuthMiddleware {
    static async validateJWT(req, _res, next) {
        const authorization = req.header("Authorization");
        if (!authorization)
            return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.NO_TOKEN_PROVIDED));
        if (!authorization.startsWith("Bearer "))
            return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.INVALID_BEARER_TOKEN));
        const token = authorization.split(" ").at(1) || "";
        try {
            const result = await jwt_adapter_1.JwtAdapter.validateAccessToken(token);
            if (!result.success) {
                if (result.reason === "expired")
                    return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.TOKEN_EXPIRED));
                return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.INVALID_TOKEN));
            }
            const user = await models_1.User.findOne({
                where: { id: result.payload.id },
                attributes: { exclude: ["password"] },
            });
            if (!user)
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_TOKEN_USER));
            if (user.status === false)
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.USER_NOT_ACTIVE));
            const userEntity = domain_1.UserEntity.payloadToken(user);
            if (Object.prototype.hasOwnProperty.call(req, "user")) {
                Reflect.deleteProperty(req, "user");
            }
            Object.defineProperty(req, "user", {
                value: userEntity,
                writable: false,
                enumerable: false,
                configurable: false,
            });
            return next();
        }
        catch (error) {
            console.log(error);
            return next(application_1.CustomError.internalServer("VALIDATE_TOKEN_ERROR"));
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
