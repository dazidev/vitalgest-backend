"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    constructor() {
        this.authRepo = new infrastructure_1.AuthRepositorie();
    }
    async loginUser(userEntityDto) {
        const { email, password } = userEntityDto;
        const response = await this.authRepo.getUser(email);
        if (!response.success)
            throw { code: response.code };
        const user = response.data;
        const isMatching = await bcrypt_1.default.compare(password, user.password);
        if (!isMatching)
            throw { code: domain_1.ERROR_CODES.CREDENTIALS_NOT_MATCH };
        const { password: pass, state, createdAt, ...userEntity } = domain_1.UserEntity.fromObject(user);
        const payload = {
            ...userEntity
        };
        const tokenAccess = await infrastructure_1.JwtAdapter.generateToken(payload, '2h', 'ACCESS');
        const tokenRefresh = await infrastructure_1.JwtAdapter.generateToken(payload, '7d', 'REFRESH');
        if (!tokenAccess && !tokenRefresh)
            throw { code: domain_1.ERROR_CODES.TOKENS_NOT_GENERATED };
        return {
            success: true,
            data: userEntity,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh
            }
        };
    }
    newAccessToken(_req, _res, _next) {
        throw new Error("Method not implemented.");
    }
}
exports.AuthService = AuthService;
