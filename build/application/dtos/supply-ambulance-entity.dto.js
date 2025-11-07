"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyAmbEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class SupplyAmbEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static validateData(avaibleQuantity, minQuantity, areaId, ambulanceId) {
        if (!avaibleQuantity)
            return domain_1.ERROR_CODES.MISSING_QUANTITY;
        if (!minQuantity)
            return domain_1.ERROR_CODES.MISSING_MIN_QUANTITY;
        if (!areaId)
            return domain_1.ERROR_CODES.MISSING_AREA_ID;
        if (!ambulanceId)
            return domain_1.ERROR_CODES.MISSING_AMBULANCE_ID;
        if (!infrastructure_1.regularExp.uuid.test(ambulanceId))
            return domain_1.ERROR_CODES.INVALID_AMBULANCE_ID;
        return true;
    }
    static create(object) {
        const { avaibleQuantity, minQuantity, areaId, supplyId, ambulanceId } = object;
        if (!supplyId)
            return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
        const error = this.validateData(avaibleQuantity, minQuantity, areaId, ambulanceId);
        if (!(error === true))
            return [error];
        return [undefined, new SupplyAmbEntityDto({ avaibleQuantity, minQuantity, areaId, supplyId, ambulanceId })];
    }
    static edit(object) {
        const { id, avaibleQuantity, minQuantity, areaId, ambulanceId } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SUPPLY_ID];
        const error = this.validateData(avaibleQuantity, minQuantity, areaId, ambulanceId);
        if (!(error === true))
            return [error];
        return [undefined, new SupplyAmbEntityDto({ id, avaibleQuantity, minQuantity, areaId, ambulanceId })];
    }
    static id(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SUPPLY_ID];
        return [undefined, new SupplyAmbEntityDto({ id })];
    }
}
exports.SupplyAmbEntityDto = SupplyAmbEntityDto;
