
import { UserEntityDto } from "../../application";
import { LoginServiceResponse, TokenServiceResponse } from "./services.interface";

export interface AuthServiceInterface {
  loginUser (userEntityDto: UserEntityDto): Promise<LoginServiceResponse>;
  newAccessToken (refreshTokenReq: string): Promise<TokenServiceResponse>;
};