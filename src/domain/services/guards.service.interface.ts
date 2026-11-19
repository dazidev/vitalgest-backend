import { AccessContext } from "../interfaces/access-context.interface";
import { GuardsEntityDto, PaginationDto } from "../../application";

export interface GuardsServiceInterface {
  createGuard(actor: AccessContext, guardEntityDto: GuardsEntityDto, userId: string): Promise<object>;
  editGuard(actor: AccessContext, guardEntityDto: GuardsEntityDto, userId: string): Promise<object>;
  deleteGuard(actor: AccessContext, id: string, userId: string): Promise<object>;
  getGuards(actor: AccessContext, paginationDto: PaginationDto): Promise<object>;
  getOneGuard(actor: AccessContext, id: string): Promise<object>;
}
