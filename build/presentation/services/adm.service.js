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
class AdmService {
    async createUser(userEntityDto) {
        let tx;
        const { name, lastname, email, password, role, position, delegationId: delegation_id } = userEntityDto;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { email: email }, transaction: tx });
            if (exists)
                throw domain_1.ERROR_CODES.EMAIL_ALREADY_REGISTERED;
            const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegation_id } });
            if (!existsDelegation)
                throw domain_1.ERROR_CODES.INVALID_DELEGATION_ID;
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const UserHashed = { name, lastname, email, hashedPassword, role, position, delegation_id };
            const userEntity = domain_1.UserEntity.create(UserHashed);
            const user = await infrastructure_1.User.create({
                name: userEntity.name,
                lastname: userEntity.lastname,
                email: userEntity.email,
                password: userEntity.password,
                status: true,
                role: userEntity.role,
                position: userEntity.position,
                delegation_id: userEntity.delegation_id,
            }, { transaction: tx });
            await tx.commit();
            const userSafe = await infrastructure_1.User.findByPk(user.id, {
                attributes: { exclude: ['password'] }
            });
            return {
                success: true,
                data: userSafe
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.INSERT_FAILED;
        }
    }
    async editUser(userEntityDto) {
        const { id, name, lastname, email, role, position, delegationId, status } = userEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } });
            if (!existsDelegation)
                throw domain_1.ERROR_CODES.INVALID_DELEGATION_ID;
            await infrastructure_1.User.update({
                name,
                lastname,
                email,
                role,
                position,
                delegation_id: delegationId,
                status: status
            }, { where: { id }, transaction: tx });
            await tx.commit();
            const userSafe = await infrastructure_1.User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            return {
                success: true,
                data: userSafe
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async deleteUser(id) {
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            await infrastructure_1.User.update({ status: false }, { where: { id }, transaction: tx });
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.DELETE_FAILED;
        }
    }
    async getAllUsers(amount, role) {
        let newAmount;
        if (amount !== 'all')
            newAmount = parseInt(amount);
        else
            newAmount = amount;
        try {
            const options = {
                attributes: { exclude: ['password'] },
            };
            if (role)
                options.where = { role };
            if (newAmount !== 'all')
                options.limit = Number(newAmount);
            const users = await infrastructure_1.User.findAll(options);
            return {
                success: true,
                data: users
            };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async changePasswordUser(id, password) {
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            await infrastructure_1.User.update({ password: hashedPassword }, { where: { id }, transaction: tx });
            await tx.commit();
            return {
                success: true
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async getUserById(id) {
        try {
            const user = await infrastructure_1.User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
            if (!user)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            return {
                success: true,
                data: user
            };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR; // todo: cambiar a error en la busqueda 
        }
    }
}
exports.AdmService = AdmService;
