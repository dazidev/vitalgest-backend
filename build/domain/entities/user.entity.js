"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id, name, lastname, email, password, status, role, position, delegation_id) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.status = status;
        this.role = role;
        this.position = position;
        this.delegation_id = delegation_id;
    }
    static create(object) {
        const { name, lastname, email, hashedPassword, role, position, delegation_id } = object;
        return new UserEntity(undefined, name, lastname, email, hashedPassword, undefined, role, position, delegation_id);
    }
    static payloadToken(object) {
        const { id, name, lastname, email, role } = object;
        return new UserEntity(id, name, lastname, email, undefined, undefined, role);
    }
    static login(object) {
        const { id, name, lastname, email, status, role, position, delegation_id } = object;
        return new UserEntity(id, name, lastname, email, undefined, status, role, position, delegation_id);
    }
}
exports.UserEntity = UserEntity;
