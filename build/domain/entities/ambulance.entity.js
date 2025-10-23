"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulanceEntity = void 0;
class AmbulanceEntity {
    constructor(id, number, brand, model, delegationId) {
        this.id = id;
        this.number = number;
        this.brand = brand;
        this.model = model;
        this.delegationId = delegationId;
    }
    static create(object) {
        const { number, brand, model, delegationId } = object;
        return new AmbulanceEntity(undefined, number, brand, model, delegationId);
    }
    static edit(object) {
        const { id, number, brand, model, delegationId } = object;
        return new AmbulanceEntity(id, number, brand, model, delegationId);
    }
}
exports.AmbulanceEntity = AmbulanceEntity;
