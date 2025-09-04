import { UserEntity } from "../entities/user.entity";
import { RepoResponse } from "./repositorie.interface";

export interface AdmRepositorieInterface {
  userExists (email: string | undefined, id: string | undefined): Promise<boolean>;
  createUser (userEntityDto: UserEntity): Promise<RepoResponse>;
  editUser (userEntityDto: UserEntity): Promise<RepoResponse>;
  deleteUser (id: string): Promise<RepoResponse>;
  getAllUsers (amount: number): Promise<RepoResponse>;
  changePasswordUser (id: string, password: string): Promise<RepoResponse>;
}