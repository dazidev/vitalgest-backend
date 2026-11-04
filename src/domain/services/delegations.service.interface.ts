import { PaginationDto } from "../../application";
import { DelegationEntity } from "../entities/delegation.entity";

export interface DelegationsServiceInterface {
  getStates(): Promise<object>;
  getMunicipalities(state: number): Promise<object>;
  createDelegation(
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object>;
  editDelegation(
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object>;
  deleteDelegation(id: string, userId: string): Promise<object>;
  getDelegations(paginationDto: PaginationDto): Promise<object>;
  getDelegation(id: string): Promise<object>;
}
