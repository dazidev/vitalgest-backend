"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class ShiftsController {
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    createShift(req, res, next) {
        const [error, shiftEntityDto] = application_1.ShiftEntityDto.create(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.shiftsService.createShift(shiftEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    editShift(req, res, next) {
        const { id } = req.params;
        const [error, guardsEntityDto] = application_1.GuardsEntityDto.edit({ id, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.shiftsService.editShift(guardsEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    deleteShift(req, res, next) {
        const { id } = req.params;
        const [error, shiftEntityDto] = application_1.ShiftEntityDto.delete({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.shiftsService.deleteShift(shiftEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    getShifts(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_GUARD_ID);
        this.shiftsService.getShifts(id)
            .then(response => res.json(response))
            .catch(error => next(application_1.CustomError.badRequest(error)));
    }
    getOneShift(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_GUARD_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_GUARD_ID);
        this.shiftsService.getOneShift(id)
            .then(response => res.json(response))
            .catch(error => next(application_1.CustomError.badRequest(error)));
    }
}
exports.ShiftsController = ShiftsController;
