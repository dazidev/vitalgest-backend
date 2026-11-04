import { GuardsEntityDto, PaginationDto } from "../../application";

export interface GuardsServiceInterface {
  createGuard(guardEntityDto: GuardsEntityDto, userId: string): Promise<object>;
  editGuard(guardEntityDto: GuardsEntityDto, userId: string): Promise<object>;
  deleteGuard(id: string, userId: string): Promise<object>;
  getGuards(paginationDto: PaginationDto): Promise<object>;
  getOneGuard(id: string): Promise<object>;
}
