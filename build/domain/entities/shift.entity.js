"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftEntity = void 0;
class ShiftEntity {
    constructor(name, ambulanceId, guardId, paramedicalId, driverId) {
        this.name = name;
        this.ambulanceId = ambulanceId;
        this.guardId = guardId;
        this.paramedicalId = paramedicalId;
        this.driverId = driverId;
    }
    static create(object) {
        const { name, ambulanceId, guardId, paramedicalId, driverId } = object;
        return new ShiftEntity(name, ambulanceId, guardId, paramedicalId, driverId);
    }
}
exports.ShiftEntity = ShiftEntity;
