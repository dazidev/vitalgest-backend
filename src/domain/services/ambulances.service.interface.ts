import { AmbulanceEntityDto } from "../../application";
import { SupplyAmbEntityDto } from "../../application/dtos/supply-ambulance-entity.dto";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface AmbulancesServiceInterface {
  createAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  editAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  deleteAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  getAmbulances(paginationDto: PaginationDto): Promise<object>;
  getOneAmbulance(id: string): Promise<object>;

  //* Supplies
  addSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  editSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  getAmbSupplies(ambulanceId: string): Promise<object>;
  getOneAmbSupply(supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>;
  getAreas(): Promise<object>;
}
