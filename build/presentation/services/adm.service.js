"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmService = void 0;
const infrastructure_1 = require("../../infrastructure");
const domain_1 = require("../../domain");
// librerias externas
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class AdmService {
    constructor() {
        this.admRepo = new infrastructure_1.AdmRepositorie();
    }
    async createUser(userEntityDto) {
        const { name, lastname, email, password, role, position } = userEntityDto;
        const existsUser = await this.admRepo.userExists(email, undefined);
        if (existsUser)
            throw { code: domain_1.ERROR_CODES.EMAIL_ALREADY_REGISTERED };
        const userId = (0, uuid_1.v4)();
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new domain_1.UserEntity(userId, name, lastname, email, hashedPassword, role, position);
        const process = await this.admRepo.createUser(user);
        if (!process.success)
            throw { code: process.code };
        return {
            success: true,
            data: {
                id: userId,
                name,
                lastname,
                email,
                role,
                position,
                state: "true"
            }
        };
    }
    async editUser(userEntityDto) {
        const { id, name, lastname, email, role, position } = userEntityDto;
        const existsUser = await this.admRepo.userExists(undefined, id);
        if (!existsUser)
            throw { code: domain_1.ERROR_CODES.USER_NOT_FOUND };
        const user = new domain_1.UserEntity(id, name, lastname, email, role, position);
        const process = await this.admRepo.editUser(user);
        if (!process.success)
            throw { code: process.code };
        return {
            success: true,
            data: {
                id,
                name,
                lastname,
                email,
                role,
                position
            }
        };
    }
    async deleteUser(id) {
        const existsUser = await this.admRepo.userExists(undefined, id);
        if (!existsUser)
            throw { code: domain_1.ERROR_CODES.USER_NOT_FOUND };
        const process = await this.admRepo.deleteUser(id);
        if (!process.success)
            throw { code: process.code };
        return { success: true };
    }
    async getAllUsers(amount) {
        let newAmount;
        if (amount !== 'all')
            newAmount = parseInt(amount);
        else
            newAmount = amount;
        const process = await this.admRepo.getAllUsers(newAmount);
        if (!process.success)
            throw { code: process.code };
        return process;
    }
    async changePasswordUser(id, password) {
        const existsUser = await this.admRepo.userExists(undefined, id);
        if (!existsUser)
            throw { code: domain_1.ERROR_CODES.USER_NOT_FOUND };
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const process = await this.admRepo.changePasswordUser(id, hashedPassword);
        if (!process.success)
            throw { code: process.code };
        return { success: true };
    }
    async getUserById(id) {
        const existsUser = await this.admRepo.userExists(undefined, id);
        if (!existsUser)
            throw { code: domain_1.ERROR_CODES.USER_NOT_FOUND };
        const process = await this.admRepo.getUserById(id);
        if (!process.success)
            throw { code: process.code };
        return process;
    }
}
exports.AdmService = AdmService;
