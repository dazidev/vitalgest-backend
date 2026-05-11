import { PaginationDto, SupplyEntityDto } from "../../application";

export interface SuppliesServiceInterface {
  createSupply(supplyEntityDto: SupplyEntityDto): Promise<object>;
  editSupply(supplyEntityDto: SupplyEntityDto): Promise<object>;
  deleteSupply(supplyEntityDto: SupplyEntityDto): Promise<object>;
  getSupplies(
    pharmacyId: string,
    paginationDto: PaginationDto,
  ): Promise<object>;
  getOneSupply(id: string): Promise<object>;
}
