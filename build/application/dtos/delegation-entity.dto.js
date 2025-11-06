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
        const { stateName, municipalityId, municipalityName } = object;
        // todo: hace falta verificar el formato de lo que viene
        if (!stateName)
            return [domain_1.ERROR_CODES.MISSING_STATE_NAME];
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        if (!municipalityName)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY_NAME];
        const name = `Delegación ${municipalityName}, ${stateName}`;
        return [undefined, new DelegationEntityDto({ name, stateName, municipalityId, municipalityName })];
    }
    static edit(object) {
        const { id, name, municipalityId } = object;
        // todo: hace falta verificar el formato de lo que viene
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        if (!name)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_NAME];
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        return [undefined, new DelegationEntityDto({ id, name, municipalityId })];
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
