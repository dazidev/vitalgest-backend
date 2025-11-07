"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class DelegationEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(object) {
        const { municipalityId } = object;
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        if (!infrastructure_1.regularExp.numIntPositive.test(municipalityId))
            return [domain_1.ERROR_CODES.INVALID_MUNICIPALITY];
        return [undefined, new DelegationEntityDto({ municipalityId })];
    }
    static edit(object) {
        const { id, municipalityId } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        if (!infrastructure_1.regularExp.numIntPositive.test(municipalityId))
            return [domain_1.ERROR_CODES.INVALID_MUNICIPALITY];
        return [undefined, new DelegationEntityDto({ id, municipalityId })];
    }
    static delete(object) {
        const { id } = object;
        // todo: hace falta verificar el formato de lo que viene
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        return [undefined, new DelegationEntityDto({ id })];
    }
}
exports.DelegationEntityDto = DelegationEntityDto;
