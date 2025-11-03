"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.handleError = (error) => {
            if (error === domain_1.ERROR_CODES.UNKNOWN_ERROR)
                return application_1.CustomError.internalServer(error);
            if (error === domain_1.ERROR_CODES.UNKNOWN_DB_ERROR)
                return application_1.CustomError.internalServer(error);
            if (error === domain_1.ERROR_CODES.TOO_MANY_REQUESTS)
                return application_1.CustomError.tooManyRequests(error);
            return application_1.CustomError.badRequest(error);
        };
    }
    loginUser(req, res, next) {
        const [error, userEntityDto] = application_1.UserEntityDto.login(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.authService.loginUser(userEntityDto)
            .then((response) => {
            const { refreshToken, accessToken, ...dataResponse } = response;
            (0, infrastructure_1.setRefreshCookie)(res, refreshToken);
            (0, infrastructure_1.setAccessCookie)(res, accessToken);
            res.json(dataResponse);
        })
            .catch((error) => next(this.handleError(error)));
    }
    newAccessToken(req, res, next) {
        const refreshTokenReq = req.signedCookies?.[infrastructure_1.REFRESH_COOKIE_NAME];
        if (!refreshTokenReq)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.NO_TOKEN_PROVIDED);
        this.authService.newAccessToken(refreshTokenReq)
            .then((response) => {
            const { accessToken, refreshToken } = response;
            (0, infrastructure_1.setRefreshCookie)(res, refreshToken);
            (0, infrastructure_1.setAccessCookie)(res, accessToken);
            res.json({
                success: "true"
            });
        })
            .catch((error) => next(this.handleError(error)));
    }
}
exports.AuthController = AuthController;
