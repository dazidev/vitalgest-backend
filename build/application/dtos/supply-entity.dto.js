"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class SupplyEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static validateData(category, avaibleQuantity, expirationDate, measurementUnit, pharmacyId) {
        if (!category)
            return domain_1.ERROR_CODES.MISSING_CATEGORY;
        if (!avaibleQuantity)
            return domain_1.ERROR_CODES.MISSING_QUANTITY;
        if (!expirationDate)
            return domain_1.ERROR_CODES.MISSING_EXPIRATION_DATE;
        if (!measurementUnit)
            return domain_1.ERROR_CODES.MISSING_MEASUREMENT_UNIT;
        if (!pharmacyId)
            return domain_1.ERROR_CODES.MISSING_PHARMACY;
        if (!infrastructure_1.regularExp.uuid.test(pharmacyId))
            return domain_1.ERROR_CODES.INVALID_PHARMACY;
        return true;
    }
    static create(object) {
        const { category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId } = object;
        const error = this.validateData(category, avaibleQuantity, expirationDate, measurementUnit, pharmacyId);
        if (!(error === true))
            return [error];
        return [undefined, new SupplyEntityDto({ category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId })];
    }
    static edit(object) {
        const { id, category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SUPPLY_ID];
        const error = this.validateData(category, avaibleQuantity, expirationDate, measurementUnit, pharmacyId);
        if (!(error === true))
            return [error];
        return [undefined, new SupplyEntityDto({ id, category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId })];
    }
    static id(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SUPPLY_ID];
        return [undefined, new SupplyEntityDto({ id })];
    }
}
exports.SupplyEntityDto = SupplyEntityDto;
