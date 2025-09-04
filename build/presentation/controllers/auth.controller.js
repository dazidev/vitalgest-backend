"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.handleError = (error) => {
            if (error.code === domain_1.ERROR_CODES.UNKNOWN_ERROR)
                return application_1.CustomError.internalServer(error.code);
            if (error.code === domain_1.ERROR_CODES.TOO_MANY_REQUESTS)
                return application_1.CustomError.tooManyRequests(error.code);
            return application_1.CustomError.badRequest(error.code);
        };
    }
    loginUser(req, res, next) {
        const [error, userEntityDto] = application_1.UserEntityDto.login(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.authService.loginUser(userEntityDto)
            .then((user) => res.json(user))
            .catch((error) => next(this.handleError(error)));
    }
    newAccessToken(_req, _res, _next) {
        throw new Error("Method not implemented.");
    }
}
exports.AuthController = AuthController;
