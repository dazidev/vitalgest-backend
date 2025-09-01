import { UserEntity } from "../entities/user.entity";
import { RepoResponse } from "./repositorie.interface";

export interface AdmRepositorieInterface {
  userExists (email: string): Promise<boolean>;
  createUser (userEntityDto: UserEntity): Promise<RepoResponse>;
}