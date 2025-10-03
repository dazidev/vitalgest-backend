import { ERROR_CODES } from "../enums/error-codes.enum";
import { Role } from "../enums/user-roles.enum";

export interface RepoResponse {
  success: boolean;
  code?: ERROR_CODES;
  data?: object | UserRepoResponse | DelegationRepoResponse | GuardRepoResponse;
  pharmacyId?: string
}

export interface UserRepoResponse {
  id: string,
  name: string,
  lastname: string,
  email: string,
  password?: string,
  role: Role,
  position?: string,
  state: string,
  createdAt?: string
}

export interface DelegationRepoResponse {
  id: string
  name: string
  state: {
    id: number
    name: string
  }
  municipality: {
    id: number
    name: string 
  }
  pharmacyId: string
}

export interface GuardRepoResponse {
  id: string
  date: string
  state: 'En curso' | 'Nueva' | 'Cerrada'
  guardChief: {
    id: string
    name: string
    lastname: string
    email: string
  }
  delegation: {
    id: string
    name: string
  }
}
