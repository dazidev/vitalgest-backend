import { DelegationEntity } from "../entities/delegation.entity";
import { RepoResponse } from "./repositorie.interface";


export interface DelegationsRepositorieInterface {
  stateExists(state: number): Promise<boolean> 
  getStates(): Promise<RepoResponse>
  getMunicipalities(state: number): Promise<RepoResponse>
  createDelegation(delegationEntity: DelegationEntity): Promise<RepoResponse>
  editDelegation(delegationEntity: DelegationEntity): Promise<RepoResponse>
  deleteDelegation(delegationId: string): Promise<RepoResponse>
  createPharmacy(pharmacyId: string): Promise<RepoResponse>
  getDelegations(amount: number | string): Promise<RepoResponse>
  getDelegation(delegationId: string): Promise<RepoResponse>
}