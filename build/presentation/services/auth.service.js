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
    async handleTokensByUser(id) {
        const user = await infrastructure_1.User.findOne({
            where: { id },
            attributes: { exclude: ["password"] },
        }).catch(() => {
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        });
        if (!user)
            throw domain_1.ERROR_CODES.USER_NOT_FOUND;
        const { ...userEntity } = domain_1.UserEntity.payloadToken(user);
        const payload = {
            ...userEntity,
        };
        const accessToken = await infrastructure_1.JwtAdapter.generateToken(payload, "2h", "ACCESS");
        const refreshToken = await infrastructure_1.JwtAdapter.generateToken(payload, "7d", "REFRESH");
        if (!accessToken && !refreshToken)
            throw domain_1.ERROR_CODES.TOKENS_NOT_GENERATED;
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    async loginUser(userEntityDto) {
        const { email, password } = userEntityDto;
        const user = await infrastructure_1.User.findOne({ where: { email } }).catch(() => {
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        });
        if (!user)
            throw domain_1.ERROR_CODES.USER_NOT_FOUND;
        const isMatching = await bcrypt_1.default.compare(password, user.password);
        if (!isMatching)
            throw domain_1.ERROR_CODES.CREDENTIALS_NOT_MATCH;
        const { delegation_id: delegationId, ...userEntity } = domain_1.UserEntity.login(user);
        if (user.status === false)
            throw domain_1.ERROR_CODES.USER_NOT_ACTIVE;
        const payload = {
            ...userEntity,
        };
        const tokenAccess = await infrastructure_1.JwtAdapter.generateToken(payload, "8h", "ACCESS");
        const tokenRefresh = await infrastructure_1.JwtAdapter.generateToken(payload, "7d", "REFRESH");
        if (!tokenAccess && !tokenRefresh)
            throw domain_1.ERROR_CODES.TOKENS_NOT_GENERATED;
        return {
            success: true,
            data: { ...userEntity, delegationId },
            accessToken: tokenAccess,
            refreshToken: tokenRefresh,
        };
    }
    async newAccessToken(refreshTokenReq) {
        const result = await infrastructure_1.JwtAdapter.validateRefreshToken(refreshTokenReq);
        if (!result.success) {
            if (result.reason === "expired")
                throw domain_1.ERROR_CODES.TOKEN_EXPIRED;
            throw domain_1.ERROR_CODES.INVALID_TOKEN;
        }
        return this.handleTokensByUser(result.payload.id);
    }
}
exports.AuthService = AuthService;
