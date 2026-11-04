import { PaginationDto, SupplyEntityDto } from "../../application";

export interface SuppliesServiceInterface {
  createSupply(
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object>;
  editSupply(supplyEntityDto: SupplyEntityDto, userId: string): Promise<object>;
  deleteSupply(
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object>;
  getSupplies(
    pharmacyId: string,
    paginationDto: PaginationDto,
  ): Promise<object>;
  getOneSupply(id: string): Promise<object>;
}
