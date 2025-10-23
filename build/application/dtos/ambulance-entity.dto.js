"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulanceEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class AmbulanceEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(object) {
        const { number, brand, model, delegationId } = object;
        if (!number)
            return [domain_1.ERROR_CODES.MISSING_NUMBER];
        if (!brand)
            return [domain_1.ERROR_CODES.MISSING_BRAND];
        if (!model)
            return [domain_1.ERROR_CODES.MISSING_MODEL];
        if (!delegationId)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        return [undefined, new AmbulanceEntityDto({ number, brand, model, delegationId })];
    }
    static edit(object) {
        const { id, number, brand, model, delegationId } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_AMBULANCE_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_AMBULANCE_ID];
        if (!number)
            return [domain_1.ERROR_CODES.MISSING_NUMBER];
        if (!brand)
            return [domain_1.ERROR_CODES.MISSING_BRAND];
        if (!model)
            return [domain_1.ERROR_CODES.MISSING_MODEL];
        if (!delegationId)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        return [undefined, new AmbulanceEntityDto({ id, number, brand, model, delegationId })];
    }
    static delete(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_AMBULANCE_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_AMBULANCE_ID];
        return [undefined, new AmbulanceEntityDto({ id })];
    }
}
exports.AmbulanceEntityDto = AmbulanceEntityDto;
