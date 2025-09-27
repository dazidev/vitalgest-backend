"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id, name, lastname, email, password, role, position, state, createdAt) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.position = position;
        this.state = state;
        this.createdAt = createdAt;
    }
    static fromObject(object) {
        const { id, name, lastname, email, password, role, position, state, createdAt } = object;
        return new UserEntity(id, name, lastname, email, password, role, position, state, createdAt);
    }
}
exports.UserEntity = UserEntity;
