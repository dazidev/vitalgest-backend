"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankMiddleware = void 0;
const application_1 = require("../../application");
const domain_1 = require("../../domain");
class RankMiddleware {
    static validate(rolRequired) {
        return (req, _res, next) => {
            const userRol = req.user.rol;
            if (!domain_1.ROLE_LIST.includes(userRol))
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_ROL));
            if (!(domain_1.ROLE_RANK[userRol] >= domain_1.ROLE_RANK[rolRequired]))
                return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.UNAUTHORIZED_RANK));
            next();
        };
    }
}
exports.RankMiddleware = RankMiddleware;
