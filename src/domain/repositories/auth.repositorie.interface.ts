import { RepoResponse, UserRepoResponse } from "./repositorie.interface";

export interface AuthRepositorieInterface {
  getUser (email?: string, id?: string): Promise<RepoResponse | UserRepoResponse>;
}