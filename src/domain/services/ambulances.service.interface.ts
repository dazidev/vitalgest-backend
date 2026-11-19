import { AccessContext } from "../interfaces/access-context.interface";
import { AmbulanceEntityDto } from "../../application";
import { SupplyAmbEntityDto } from "../../application/dtos/supply-ambulance-entity.dto";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface AmbulancesServiceInterface {
  createAmbulance(
    actor: AccessContext,
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  editAmbulance(
    actor: AccessContext,
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  deleteAmbulance(
    actor: AccessContext,
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  getAmbulances(actor: AccessContext, paginationDto: PaginationDto): Promise<object>;
  getOneAmbulance(actor: AccessContext, id: string): Promise<object>;

  //* Supplies
  addSupply(
    actor: AccessContext,
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  editSupply(
    actor: AccessContext,
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSupply(
    actor: AccessContext,
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object>;
  getAmbSupplies(actor: AccessContext, ambulanceId: string, paginationDto: PaginationDto): Promise<object>;
  getOneAmbSupply(actor: AccessContext, supplyAmbEntityDto: SupplyAmbEntityDto): Promise<object>;
  getAreas(): Promise<object>;
}
