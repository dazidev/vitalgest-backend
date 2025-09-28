import { DelegationsServiceInterface } from "../../domain";
import { DelegationsRepositorie } from '../../infrastructure/repositories/delegations.repositorie';
import { ERROR_CODES } from '../../domain/enums/error-codes.enum';
import { DelegationEntity } from "../../domain/entities/delegation.entity";

import { v4 as uuidv4 } from 'uuid'


export class DelegationsService implements DelegationsServiceInterface {
  private readonly delegationsRepo: DelegationsRepositorie

  constructor (){
    this.delegationsRepo = new DelegationsRepositorie()
  }
  
  async getStates(): Promise<object> {
    const states = await this.delegationsRepo.getStates()

    if (!states.success) throw { code: states.code }
    if (Array.isArray(states.data)){
      if (states.data.length === 0) throw { code: ERROR_CODES.STATES_NOT_FOUND}
    }

    return states
  }

  async getMunicipalities(state: number): Promise<object> {
    const exists = await this.delegationsRepo.stateExists(state)
    if (!exists) throw { code: ERROR_CODES.STATE_NOT_FOUND }

    const municipalities = await this.delegationsRepo.getMunicipalities(state)

    if (!municipalities.success) throw { code: municipalities.code }
    if (Array.isArray(municipalities.data)){
      if (municipalities.data.length === 0) throw { code: ERROR_CODES.MUNICIPALITIES_NOT_FOUND }
    }

    return municipalities
  }

  async createDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const id = uuidv4()

    const pharmacy = await this.delegationsRepo.createPharmacy(id)
    if (!pharmacy.success) throw { code: pharmacy.code }
    const pharmacyId = pharmacy.pharmacyId

    const delegation = await this.delegationsRepo.createDelegation({...delegationEntity, pharmacyId})
    if (!delegation.success) throw {code: delegation.code} 
    // todo: eliminar la farmacia si hay algun problema al crear la delegación

    return delegation
    
  }

  async editDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const delegation = await this.delegationsRepo.editDelegation(delegationEntity)
    if (!delegation.success) throw { code: delegation.code }

    return delegation
  }
  
  async deleteDelegation(delegationId: string): Promise<object> {
    // todo: eliminar farmacia también, luego todo lo vinculado con la farmacia y delegación.
    const delegation = await this.delegationsRepo.deleteDelegation(delegationId)
    if (!delegation.success) throw { code: delegation.code }

    return delegation
  }

  async getDelegations(amount: string): Promise<object> {
    let newAmount
    if (amount !== 'all') newAmount = parseInt(amount)
    else newAmount = amount

    const delegation = await this.delegationsRepo.getDelegations(newAmount)
    if (!delegation.success) throw { code: delegation.code }

    return delegation
    
  }

  async getDelegation(delegationId: string): Promise<object> {
    const delegation = await this.delegationsRepo.getDelegation(delegationId)
    if (!delegation.success) throw { code: delegation.code }

    return delegation
  }
  
}