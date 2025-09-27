import { ERROR_CODES } from "../enums/error-codes.enum";
import { Role } from "../enums/user-roles.enum";

export interface RepoResponse {
  success: boolean;
  code?: ERROR_CODES;
  data?: object | UserRepoResponse;
}

export interface UserRepoResponse {
  id: string,
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: Role,
  state: string, 
}