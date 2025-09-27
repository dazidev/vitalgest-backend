import { AuthServiceInterface } from "../../domain/services/auth.service.interface";
import { UserEntityDto } from "../../application";
import { ERROR_CODES, LoginServiceResponse, RepoResponse, TokenServiceResponse, UserEntity, UserRepoResponse } from "../../domain";
import { AuthRepositorie, JwtAdapter } from "../../infrastructure";

import bcrypt from 'bcrypt'

export class AuthService implements AuthServiceInterface {
  private readonly authRepo: AuthRepositorie;
  
  constructor () {
    this.authRepo = new AuthRepositorie();
  }

  async handleTokensByUser (id?: string): Promise<TokenServiceResponse> {
    const response: RepoResponse = await this.authRepo.getUser(undefined, id);
    if (!response.success) throw { code: response.code };

    const user: UserRepoResponse = response.data as UserRepoResponse;
    const {password: pass, state, createdAt, ...userEntity} = UserEntity.fromObject(user);

    const payload = {
      ...userEntity
    }

    const accessToken = await JwtAdapter.generateToken(payload, '2h', 'ACCESS');
    const refreshToken = await JwtAdapter.generateToken(payload, '7d', 'REFRESH');
    if (!accessToken && !refreshToken) throw { code: ERROR_CODES.TOKENS_NOT_GENERATED }

    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!
    }
  }

  async loginUser(userEntityDto: UserEntityDto): Promise<LoginServiceResponse> {
    const { email, password } = userEntityDto

    const response: RepoResponse = await this.authRepo.getUser(email!);

    if (!response.success) throw { code: response.code };

    const user: UserRepoResponse = response.data as UserRepoResponse;
    
    const isMatching = await bcrypt.compare(password!, user.password);
    if (!isMatching) throw { code: ERROR_CODES.CREDENTIALS_NOT_MATCH };

    const {password: pass, state, createdAt, ...userEntity} = UserEntity.fromObject(user);

    if (state === 'false') throw { code: ERROR_CODES.USER_NOT_ACTIVE }

    const payload = {
      ...userEntity
    }

    const tokenAccess = await JwtAdapter.generateToken(payload, '2h', 'ACCESS');
    const tokenRefresh = await JwtAdapter.generateToken(payload, '7d', 'REFRESH');
    if (!tokenAccess && !tokenRefresh) throw { code: ERROR_CODES.TOKENS_NOT_GENERATED }

    return {
      success: true,
      data: userEntity,
      accessToken: tokenAccess!,
      refreshToken: tokenRefresh!
    }
  }

  async newAccessToken(refreshTokenReq: string): Promise<TokenServiceResponse> {
    const result = await JwtAdapter.validateRefreshToken<{id: string}>(refreshTokenReq)
    if (!result.success) {
      if (result.reason === 'expired') throw { code: ERROR_CODES.TOKEN_EXPIRED };
      throw { code: ERROR_CODES.INVALID_TOKEN }
    }
    
    return this.handleTokensByUser(result.payload.id)
  }
    
}