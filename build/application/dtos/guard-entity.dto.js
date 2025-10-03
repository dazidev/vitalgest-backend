"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsEntityDto = void 0;
const domain_1 = require("../../domain");
const uuid_1 = require("uuid");
const infrastructure_1 = require("../../infrastructure");
class GuardsEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(object) {
        const { guardChief, date, delegationId } = object;
        const validDate = (0, infrastructure_1.isDateNotExpired)(new Date(date));
        if (!guardChief)
            return [domain_1.ERROR_CODES.MISSING_GUARD_CHIEF];
        if (!infrastructure_1.regularExp.uuid.test(guardChief))
            return [domain_1.ERROR_CODES.INVALID_GUARD_CHIEF];
        if (!date)
            return [domain_1.ERROR_CODES.MISSING_DATE];
        if (!validDate)
            return [domain_1.ERROR_CODES.DATE_EXPIRED];
        if (!infrastructure_1.regularExp.date.test(date))
            return [domain_1.ERROR_CODES.INVALID_DATE];
        if (!delegationId)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(delegationId))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        const id = (0, uuid_1.v4)();
        return [undefined, new GuardsEntityDto({ id, guardChief, date, delegationId })];
    }
    static edit(object) {
        const { id, guardChief, date, delegationId } = object;
        const validDate = (0, infrastructure_1.isDateNotExpired)(new Date(date));
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_GUARD_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_GUARD_ID];
        if (!guardChief)
            return [domain_1.ERROR_CODES.MISSING_GUARD_CHIEF];
        if (!date)
            return [domain_1.ERROR_CODES.MISSING_DATE];
        if (!validDate)
            return [domain_1.ERROR_CODES.DATE_EXPIRED];
        if (!infrastructure_1.regularExp.date.test(date))
            return [domain_1.ERROR_CODES.INVALID_DATE];
        if (!delegationId)
            return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
        if (!infrastructure_1.regularExp.uuid.test(delegationId))
            return [domain_1.ERROR_CODES.INVALID_DELEGATION_ID];
        return [undefined, new GuardsEntityDto({ id, guardChief, date, delegationId })];
    }
    static delete(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_GUARD_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_GUARD_ID];
        return [undefined, new GuardsEntityDto({ id })];
    }
}
exports.GuardsEntityDto = GuardsEntityDto;
