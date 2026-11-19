import { AccessContext } from "../interfaces/access-context.interface";
import { PaginationDto, SupplyEntityDto } from "../../application";

export interface SuppliesServiceInterface {
  createSupply(
    actor: AccessContext,
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object>;
  editSupply(actor: AccessContext, supplyEntityDto: SupplyEntityDto, userId: string): Promise<object>;
  deleteSupply(
    actor: AccessContext,
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object>;
  getSupplies(
    actor: AccessContext,
    pharmacyId: string,
    paginationDto: PaginationDto,
  ): Promise<object>;
  getOneSupply(actor: AccessContext, id: string): Promise<object>;
}
