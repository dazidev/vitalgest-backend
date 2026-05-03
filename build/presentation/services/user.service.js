"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const infrastructure_1 = require("../../infrastructure");
const domain_1 = require("../../domain");
// librerias externas
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class UserService {
    async changePassword(id, currentPass, newPass) {
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            const isMatching = await bcrypt_1.default.compare(currentPass, exists.password);
            if (!isMatching)
                throw domain_1.ERROR_CODES.CREDENTIALS_NOT_MATCH;
            const hashedPassword = await bcrypt_1.default.hash(newPass, 10);
            await infrastructure_1.User.update({ password: hashedPassword }, { where: { id }, transaction: tx });
            await tx.commit();
            return {
                success: true,
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async changeInfo(id, name, lastname) {
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            await infrastructure_1.User.update({
                name,
                lastname,
            }, { where: { id }, transaction: tx });
            await tx.commit();
            const userSafe = await infrastructure_1.User.findByPk(id, {
                attributes: { exclude: ["password"] },
            });
            return {
                success: true,
                data: userSafe,
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async attachSignatureImage(id, key) {
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const exists = await infrastructure_1.User.findOne({ where: { id }, transaction: tx });
            if (!exists)
                throw domain_1.ERROR_CODES.USER_NOT_FOUND;
            await infrastructure_1.User.update({
                signature: key,
            }, { where: { id }, transaction: tx });
            await tx.commit();
            return {
                success: true,
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
}
exports.UserService = UserService;
