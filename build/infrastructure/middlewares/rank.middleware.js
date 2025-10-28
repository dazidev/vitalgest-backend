"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankMiddleware = void 0;
const application_1 = require("../../application");
const domain_1 = require("../../domain");
class RankMiddleware {
    static validate(rolRequired, exception = false) {
        return (req, _res, next) => {
            const userRole = req.user.role;
            if (!domain_1.ROLE_LIST.includes(userRole))
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_ROLE));
            if (exception === true) { //* exepciones 
                const { role } = req.query;
                if (role) {
                    if (!(domain_1.ROLE_RANK[userRole] >= domain_1.ROLE_RANK['head_guard']))
                        return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.UNAUTHORIZED_RANK));
                    next();
                }
            }
            if (!(domain_1.ROLE_RANK[userRole] >= domain_1.ROLE_RANK[rolRequired]))
                return next(application_1.CustomError.unauthorized(domain_1.ERROR_CODES.UNAUTHORIZED_RANK));
            next();
        };
    }
}
exports.RankMiddleware = RankMiddleware;
