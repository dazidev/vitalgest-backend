import { GuardsEntityDto, PaginationDto } from "../../application";

export interface GuardsServiceInterface {
  createGuard(guardEntityDto: GuardsEntityDto): Promise<object>;
  editGuard(guardEntityDto: GuardsEntityDto): Promise<object>;
  deleteGuard(id: string): Promise<object>;
  getGuards(paginationDto: PaginationDto): Promise<object>;
  getOneGuard(id: string): Promise<object>;
}
