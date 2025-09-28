"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntityDto = void 0;
const domain_1 = require("../../domain");
const uuid_1 = require("uuid");
const infrastructure_1 = require("../../infrastructure");
class DelegationEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(object) {
        const { name, stateId, municipalityId } = object;
        // todo: hace falta verificar el formato de lo que viene
        if (!name)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_NAME];
        if (!stateId)
            return [domain_1.ERROR_CODES.MISSING_STATE_ID];
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        const id = (0, uuid_1.v4)();
        return [undefined, new DelegationEntityDto({ id, name, stateId, municipalityId })];
    }
    static edit(object) {
        const { id, name, stateId, municipalityId } = object;
        // todo: hace falta verificar el formato de lo que viene
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        if (!name)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_NAME];
        if (!stateId)
            return [domain_1.ERROR_CODES.MISSING_STATE_ID];
        if (!municipalityId)
            return [domain_1.ERROR_CODES.MISSING_MUNICIPALITY];
        return [undefined, new DelegationEntityDto({ id, name, stateId, municipalityId })];
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
