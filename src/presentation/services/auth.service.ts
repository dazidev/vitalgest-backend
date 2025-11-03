import { AuthServiceInterface } from "../../domain/services/auth.service.interface";
import { UserEntityDto } from "../../application";
import { ERROR_CODES, LoginServiceResponse, TokenServiceResponse, UserEntity } from "../../domain";
import { JwtAdapter, User } from "../../infrastructure";

import bcrypt from 'bcrypt'

export class AuthService implements AuthServiceInterface {


  async handleTokensByUser(id?: string): Promise<TokenServiceResponse> {

    const user = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!user) throw ERROR_CODES.USER_NOT_FOUND

    const { ...userEntity } = UserEntity.payloadToken(user);

    const payload = {
      ...userEntity
    }

    const accessToken = await JwtAdapter.generateToken(payload, '2h', 'ACCESS');
    const refreshToken = await JwtAdapter.generateToken(payload, '7d', 'REFRESH');
    if (!accessToken && !refreshToken) throw ERROR_CODES.TOKENS_NOT_GENERATED

    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!
    }
  }

  async loginUser(userEntityDto: UserEntityDto): Promise<LoginServiceResponse> {

    const { email, password } = userEntityDto

    const user = await User.findOne({ where: { email } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!user) throw ERROR_CODES.USER_NOT_FOUND

    const isMatching = await bcrypt.compare(password!, user.password)
    if (!isMatching) throw ERROR_CODES.CREDENTIALS_NOT_MATCH

    const { delegation_id: delegationId, ...userEntity } = UserEntity.login(user);

    if (user.status === false) throw ERROR_CODES.USER_NOT_ACTIVE

    const payload = {
      ...userEntity
    }

    const tokenAccess = await JwtAdapter.generateToken(payload, '8h', 'ACCESS')
    const tokenRefresh = await JwtAdapter.generateToken(payload, '7d', 'REFRESH')
    if (!tokenAccess && !tokenRefresh) throw ERROR_CODES.TOKENS_NOT_GENERATED


    return {
      success: true,
      data: { ...userEntity, delegationId },
      accessToken: tokenAccess!,
      refreshToken: tokenRefresh!
    }
  }

  async newAccessToken(refreshTokenReq: string): Promise<TokenServiceResponse> {
    const result = await JwtAdapter.validateRefreshToken<{ id: string }>(refreshTokenReq)
    if (!result.success) {
      if (result.reason === 'expired') throw ERROR_CODES.TOKEN_EXPIRED
      throw ERROR_CODES.INVALID_TOKEN
    }

    return this.handleTokensByUser(result.payload.id)
  }

}