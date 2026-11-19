import { AccessContext } from "../interfaces/access-context.interface";
import { UserEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface AdmServiceInterface {
  createUser(actor: AccessContext, userEntityDto: UserEntityDto, userId: string): Promise<object>;
  editUser(actor: AccessContext, userEntityDto: UserEntityDto, userId: string): Promise<object>;
  deleteUser(actor: AccessContext, id: string, userId: string): Promise<object>;
  changePasswordUser(
    actor: AccessContext,
    id: string,
    password: string,
    userId: string,
  ): Promise<object>;
  getAllUsers(actor: AccessContext, paginationDto: PaginationDto): Promise<object>;
  getUserById(actor: AccessContext, id: string): Promise<object>;
}
