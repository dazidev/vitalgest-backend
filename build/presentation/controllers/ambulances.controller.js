"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulancesController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class AmbulancesController {
    constructor(ambulancesService) {
        this.ambulancesService = ambulancesService;
    }
    createAmbulance(req, res, next) {
        const [error, ambulanceEntityDto] = application_1.AmbulanceEntityDto.create(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.ambulancesService.createAmbulance(ambulanceEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    editAmbulance(req, res, next) {
        const { id } = req.params;
        const [error, ambulanceEntityDto] = application_1.AmbulanceEntityDto.edit({ id, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.ambulancesService.editAmbulance(ambulanceEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    deleteAmbulance(req, res, next) {
        const { id } = req.params;
        const [error, ambulanceEntityDto] = application_1.AmbulanceEntityDto.delete({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.ambulancesService.deleteAmbulance(ambulanceEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    getAmbulances(req, res, next) {
        const { amount } = req.params;
        if (!amount)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_AMOUNT);
        this.ambulancesService.getAmbulances(amount)
            .then(response => res.json(response))
            .catch(error => next(application_1.CustomError.badRequest(error)));
    }
    getOneAmbulance(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_AMBULANCE_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_AMBULANCE_ID);
        this.ambulancesService.getOneAmbulance(id)
            .then(response => res.json(response))
            .catch(error => next(application_1.CustomError.badRequest(error)));
    }
}
exports.AmbulancesController = AmbulancesController;
