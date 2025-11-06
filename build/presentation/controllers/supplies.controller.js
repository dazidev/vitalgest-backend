"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliesController = void 0;
const domain_1 = require("../../domain");
const supply_entity_dto_1 = require("../../application/dtos/supply-entity.dto");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class SuppliesController {
    constructor(suppliesService) {
        this.suppliesService = suppliesService;
    }
    createSupply(req, res, next) {
        const { id: pharmacyId } = req.params;
        const [error, supplyEntityDto] = supply_entity_dto_1.SupplyEntityDto.create({ ...req.body, pharmacyId });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.suppliesService.createSupply(supplyEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    editSupply(req, res, next) {
        const { id } = req.params;
        const [error, supplyEntityDto] = supply_entity_dto_1.SupplyEntityDto.edit({ id, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.suppliesService.editSupply(supplyEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    deleteSupply(req, res, next) {
        const { id } = req.params;
        const [error, supplyEntityDto] = supply_entity_dto_1.SupplyEntityDto.id({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.suppliesService.deleteSupply(supplyEntityDto)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    getSupplies(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_PHARMACY);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_PHARMACY);
        this.suppliesService.getSupplies(id)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    getOneSupply(req, res, next) {
        const { id } = req.params;
        const [error, supplyEntityDto] = supply_entity_dto_1.SupplyEntityDto.id({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        const { id: supplyId } = supplyEntityDto;
        this.suppliesService.getOneSupply(supplyId)
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
}
exports.SuppliesController = SuppliesController;
