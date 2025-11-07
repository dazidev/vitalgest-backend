"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntity = void 0;
class DelegationEntity {
    constructor(id, municipalityId, pharmacyId) {
        this.id = id;
        this.municipalityId = municipalityId;
        this.pharmacyId = pharmacyId;
    }
    static fromObject(object) {
        const { id, municipalityId, pharmacyId } = object;
        return new DelegationEntity(id, municipalityId, pharmacyId);
    }
}
exports.DelegationEntity = DelegationEntity;
