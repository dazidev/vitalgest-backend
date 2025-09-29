"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntity = void 0;
class DelegationEntity {
    constructor(id, name, //* se adjunta nombre de delegación
    stateId, stateName, municipalityId, municipalityName, pharmacyId) {
        this.id = id;
        this.name = name;
        this.stateId = stateId;
        this.stateName = stateName;
        this.municipalityId = municipalityId;
        this.municipalityName = municipalityName;
        this.pharmacyId = pharmacyId;
    }
    static fromObject(object) {
        const { id, name, stateId, stateName, municipalityId, municipalityName, pharmacyId } = object;
        return new DelegationEntity(id, name, stateId, stateName, municipalityId, municipalityName, pharmacyId);
    }
}
exports.DelegationEntity = DelegationEntity;
