"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class GuardsController {
    constructor(guardsService) {
        this.guardsService = guardsService;
    }
    createGuard(req, res, next) {
        const [error, guardsEntityDto] = application_1.GuardsEntityDto.create(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.guardsService
            .createGuard(guardsEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    editGuard(req, res, next) {
        const { id } = req.params;
        const [error, guardsEntityDto] = application_1.GuardsEntityDto.edit({ id, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.guardsService
            .editGuard(guardsEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    deleteGuard(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_GUARD_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_GUARD_ID);
        this.guardsService
            .deleteGuard(id)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    getGuards(req, res, next) {
        const { amount } = req.params;
        if (!amount)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_AMOUNT);
        this.guardsService
            .getGuards(amount)
            .then((response) => res.json(response))
            .catch((error) => next(application_1.CustomError.badRequest(error)));
    }
    getOneGuard(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_GUARD_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_GUARD_ID);
        this.guardsService
            .getOneGuard(id)
            .then((response) => res.json(response))
            .catch((error) => next(application_1.CustomError.badRequest(error)));
    }
}
exports.GuardsController = GuardsController;
