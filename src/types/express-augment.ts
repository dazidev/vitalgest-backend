import { Role } from "../domain";

export interface UserRepoResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  role: Role;
  position?: string;
  state: string;
  createdAt?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserRepoResponse;
  }
}

export {};
