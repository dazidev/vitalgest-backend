"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class DelegationsController {
    constructor(delegationsService) {
        this.delegationsService = delegationsService;
        // todo: Todo lo que termine en NOT_FOUND hay que cambiarle a un estado 404
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
    createDelegation(req, res, next) {
        const [error, delegateEntityDto] = application_1.DelegationEntityDto.create({ ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.delegationsService.createDelegation(delegateEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
    editDelegation(req, res, next) {
        const [error, delegateEntityDto] = application_1.DelegationEntityDto.edit({ ...req.params, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.delegationsService.editDelegation(delegateEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
    deleteDelegation(req, res, next) {
        const [error, delegateEntityDto] = application_1.DelegationEntityDto.delete({ ...req.params, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        const { id } = delegateEntityDto;
        this.delegationsService.deleteDelegation(id)
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
    getDelegations(req, res, next) {
        const { amount } = req.params;
        // todo: verificar que venga un número o un 'all'
        if (!amount)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_AMOUNT);
        this.delegationsService.getDelegations(amount)
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
    getDelegation(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_DELEGATION_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_DELEGATION_ID);
        this.delegationsService.getDelegation(id)
            .then((response) => res.json(response))
            .catch((err) => next(this.handleError(err)));
    }
}
exports.DelegationsController = DelegationsController;
