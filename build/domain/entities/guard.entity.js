"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardEntity = void 0;
class GuardEntity {
    constructor(id, guardChief, date, delegationId) {
        this.id = id;
        this.guardChief = guardChief;
        this.date = date;
        this.delegationId = delegationId;
    }
    static fromObject(object) {
        const { id, guardChief, date, delegationId } = object;
        return new GuardEntity(id, guardChief, date, delegationId);
    }
}
exports.GuardEntity = GuardEntity;
