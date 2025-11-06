"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationEntity = void 0;
class DelegationEntity {
    constructor(id, name, //* se adjunta nombre de delegación
    stateName, municipalityId, municipalityName, pharmacyId) {
        this.id = id;
        this.name = name;
        this.stateName = stateName;
        this.municipalityId = municipalityId;
        this.municipalityName = municipalityName;
        this.pharmacyId = pharmacyId;
    }
    static fromObject(object) {
        const { id, name, stateName, municipalityId, municipalityName, pharmacyId } = object;
        return new DelegationEntity(id, name, stateName, municipalityId, municipalityName, pharmacyId);
    }
}
exports.DelegationEntity = DelegationEntity;
