"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class ShiftEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static validateData(ambulanceId, guardId, paramedicalId, driverId) {
        if (!ambulanceId)
            return domain_1.ERROR_CODES.MISSING_AMBULANCE_ID;
        if (!infrastructure_1.regularExp.uuid.test(ambulanceId))
            return domain_1.ERROR_CODES.INVALID_AMBULANCE_ID;
        if (!guardId)
            return domain_1.ERROR_CODES.MISSING_GUARD_ID;
        if (!infrastructure_1.regularExp.uuid.test(guardId))
            return domain_1.ERROR_CODES.INVALID_GUARD_ID;
        if (!paramedicalId)
            return domain_1.ERROR_CODES.MISSING_PARAMEDICAL_ID;
        if (!infrastructure_1.regularExp.uuid.test(paramedicalId))
            return domain_1.ERROR_CODES.INVALID_PARAMEDICAL_ID;
        if (!driverId)
            return domain_1.ERROR_CODES.MISSING_DRIVER_ID;
        if (!infrastructure_1.regularExp.uuid.test(driverId))
            return domain_1.ERROR_CODES.INVALID_DRIVER_ID;
        return true;
    }
    static create(object) {
        const { ambulanceId, guardId, paramedicalId, driverId } = object;
        const error = this.validateData(ambulanceId, guardId, paramedicalId, driverId);
        if (!(error === true))
            return [error];
        return [undefined, new ShiftEntityDto({ ambulanceId, guardId, paramedicalId, driverId })];
    }
    static edit(object) {
        const { id, name, ambulanceId, guardId, paramedicalId, driverId } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SHIFT_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SHIFT_ID];
        if (!name)
            return [domain_1.ERROR_CODES.MISSING_NAME];
        const error = this.validateData(ambulanceId, guardId, paramedicalId, driverId);
        if (!(error === true))
            return [error];
        return [undefined, new ShiftEntityDto({ id, name, ambulanceId, guardId, paramedicalId, driverId })];
    }
    static delete(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_SHIFT_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_SHIFT_ID];
        return [undefined, new ShiftEntityDto({ id })];
    }
}
exports.ShiftEntityDto = ShiftEntityDto;
