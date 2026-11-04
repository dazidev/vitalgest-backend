import { UserEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface AdmServiceInterface {
  createUser(userEntityDto: UserEntityDto, userId: string): Promise<object>;
  editUser(userEntityDto: UserEntityDto, userId: string): Promise<object>;
  deleteUser(id: string, userId: string): Promise<object>;
  changePasswordUser(
    id: string,
    password: string,
    userId: string,
  ): Promise<object>;
  getAllUsers(paginationDto: PaginationDto): Promise<object>;
  getUserById(id: string): Promise<object>;
}
