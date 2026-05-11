import { PaginationDto } from "../../application";
import { DelegationEntity } from "../entities/delegation.entity";

export interface DelegationsServiceInterface {
  getStates(): Promise<object>;
  getMunicipalities(state: number): Promise<object>;
  createDelegation(delegationEntity: DelegationEntity): Promise<object>;
  editDelegation(delegationEntity: DelegationEntity): Promise<object>;
  deleteDelegation(id: string): Promise<object>;
  getDelegations(paginationDto: PaginationDto): Promise<object>;
  getDelegation(id: string): Promise<object>;
}
