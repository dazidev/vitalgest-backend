
import { UserEntityDto } from "../../application";

export interface AdmServiceInterface {
  createUser (userEntityDto: UserEntityDto): Promise<object>;
  editUser (userEntityDto: UserEntityDto): Promise<object>;
  deleteUser (id: string): Promise<object>;
  getAllUsers (amount: string): Promise<object>;
  changePasswordUser (id: string, password: string): Promise<object>;
  getUserById (id: string): Promise<object>;
};