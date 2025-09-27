"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
class DelegationsController {
    constructor(delegationsService) {
        this.delegationsService = delegationsService;
        // todo: Todo lo que termine en NOT_FOUND hay que cambiarle a un estado 404
        this.handleError = (error) => {
            if (error.code === domain_1.ERROR_CODES.UNKNOWN_ERROR)
                return application_1.CustomError.internalServer(error.code);
            if (error.code === domain_1.ERROR_CODES.TOO_MANY_REQUESTS)
                return application_1.CustomError.tooManyRequests(error.code);
            return application_1.CustomError.badRequest(error.code);
        };
    }
    getStates(_req, res, next) {
        this.delegationsService.getStates()
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
    getMunicipalities(req, res, next) {
        const { stateId } = req.params;
        const numberStateId = parseInt(stateId);
        if (!stateId)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_STATE_ID);
        if (typeof numberStateId !== 'number' || numberStateId <= 0)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_STATE_ID);
        this.delegationsService.getMunicipalities(parseInt(stateId))
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
}
exports.DelegationsController = DelegationsController;
