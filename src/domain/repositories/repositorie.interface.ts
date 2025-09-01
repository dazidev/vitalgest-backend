import { ERROR_CODES } from "../enums/error-codes.enum";

export interface RepoResponse {
  success: boolean;
  code?: ERROR_CODES;
}