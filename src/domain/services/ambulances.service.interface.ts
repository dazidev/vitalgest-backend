import { AmbulanceEntityDto } from "../../application";
import { SupplyAmbEntityDto } from '../../application/dtos/supply-ambulance-entity.dto';


export interface AmbulancesServiceInterface {
  createAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  editAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  deleteAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  getAmbulances (amount: string): Promise<object>;
  getOneAmbulance (id: string): Promise<object>;

  //* Supplies
  addSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>
  editSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>
  deleteSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>
  getAmbSupplies(ambulanceId: string): Promise<object>
  getOneAmbSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>
  getAreas(): Promise<object>;
};