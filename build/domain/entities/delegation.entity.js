"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntity = void 0;
class DelegationEntity {
    constructor(id, name, //* se adjunta nombre de delegación
    stateId, municipalityId, pharmacyId) {
        this.id = id;
        this.name = name;
        this.stateId = stateId;
        this.municipalityId = municipalityId;
        this.pharmacyId = pharmacyId;
    }
    static fromObject(object) {
        const { id, name, stateId, municipalityId, pharmacyId } = object;
        return new DelegationEntity(id, name, stateId, municipalityId, pharmacyId);
    }
}
exports.DelegationEntity = DelegationEntity;
