import { AccessContext } from "../interfaces/access-context.interface";
import { PaginationDto } from "../../application";
import { DelegationEntity } from "../entities/delegation.entity";

export interface DelegationsServiceInterface {
  getStates(): Promise<object>;
  getMunicipalities(state: number): Promise<object>;
  createDelegation(
    actor: AccessContext,
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object>;
  editDelegation(
    actor: AccessContext,
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object>;
  deleteDelegation(actor: AccessContext, id: string, userId: string): Promise<object>;
  getDelegations(actor: AccessContext, paginationDto: PaginationDto): Promise<object>;
  getDelegation(actor: AccessContext, id: string): Promise<object>;
}
