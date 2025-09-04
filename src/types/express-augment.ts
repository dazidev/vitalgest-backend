import { UserRepoResponse } from "../domain";

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserRepoResponse;
  }
}

export {};