import { UserEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface AdmServiceInterface {
  createUser(userEntityDto: UserEntityDto): Promise<object>;
  editUser(userEntityDto: UserEntityDto): Promise<object>;
  deleteUser(id: string): Promise<object>;
  getAllUsers(paginationDto: PaginationDto): Promise<object>;
  changePasswordUser(id: string, password: string): Promise<object>;
  getUserById(id: string): Promise<object>;
}
