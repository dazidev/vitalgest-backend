import { AmbulanceEntityDto } from "../../application";


export interface AmbulancesServiceInterface {
  createAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  editAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  deleteAmbulance (ambulanceEntityDto: AmbulanceEntityDto): Promise<object>;
  getAmbulances (amount: string): Promise<object>;
  getOneAmbulance (id: string): Promise<object>;
};