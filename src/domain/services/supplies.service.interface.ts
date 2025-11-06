import { SupplyEntityDto } from "../../application";


export interface SuppliesServiceInterface {
  createSupply (supplyEntityDto: SupplyEntityDto): Promise<object>
  editSupply (supplyEntityDto: SupplyEntityDto): Promise<object>
  deleteSupply (supplyEntityDto: SupplyEntityDto): Promise<object>
  getSupplies (pharmacyId: string): Promise<object>
  getOneSupply (id: string): Promise<object>
};