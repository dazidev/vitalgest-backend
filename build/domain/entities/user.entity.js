"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id, name, lastname, email, password, rol, state, createdAt) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.state = state;
        this.createdAt = createdAt;
    }
    static fromObject(object) {
        const { id, name, lastname, email, password, rol, state, createdAt } = object;
        return new UserEntity(id, name, lastname, email, password, rol, state, createdAt);
    }
}
exports.UserEntity = UserEntity;
