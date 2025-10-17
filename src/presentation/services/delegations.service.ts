import { DelegationsServiceInterface } from "../../domain";
import { ERROR_CODES } from '../../domain/enums/error-codes.enum';
import { DelegationEntity } from "../../domain/entities/delegation.entity";

import { Municipality, sequelize, State } from "../../infrastructure";
import { Transaction } from 'sequelize';
import Pharmacy from '../../infrastructure/models/store/sequelize/pharmacy-model.store';
import Delegation from '../../infrastructure/models/store/sequelize/delegation-model.store';


export class DelegationsService implements DelegationsServiceInterface {
  
  async getStates(): Promise<object> {
    const states = await State.findAll()
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (states.length === 0) throw { code: ERROR_CODES.STATES_NOT_FOUND }

    return states
  }

  async getMunicipalities(state: number): Promise<object> {
    const exists = await State.findOne({ where: { id: state } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!exists) throw { code: ERROR_CODES.STATE_NOT_FOUND }

    const municipalities = await Municipality.findAll({ where: { state_id: state } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (municipalities.length === 0) throw { code: ERROR_CODES.MUNICIPALITIES_NOT_FOUND }

    return municipalities
  }

  async createDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { name, stateId, municipalityId } = delegationEntity

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()
      
      const pharmacy = await Pharmacy.create()

      const delegation = await Delegation.create({
        name: name!,
        state_id: stateId!,
        municipality_id: municipalityId!,
        pharmacy_id: pharmacy.id
      })

      await tx.commit()

      return delegation

    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.INSERT_FAILED }
    }
    
  }

  async editDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { id, name, stateId, municipalityId } = delegationEntity

    const exists = await Delegation.findOne({ where: { id } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!exists) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }
    
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const delegation = await Delegation.update({
        name: name,
        state_id: stateId,
        municipality_id: municipalityId
      }, { where: { id } })

      await tx.commit()

      return delegation
    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }

  }
  
  async deleteDelegation(id: string): Promise<object> {
    // todo: eliminar luego todo lo vinculado con la farmacia y delegación.
    const count = await Delegation.destroy({ where: { id } })

    if (count === 0) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }
    
    return { success: true }

  }

  async getDelegations(amount: string): Promise<object> {
    let newAmount
    if (amount !== 'all') newAmount = parseInt(amount)
    else newAmount = amount

    let delegations

    newAmount === 'all'
      ? delegations = await Delegation.findAll()
      : delegations = await Delegation.findAll({ limit: newAmount as number })

    if (delegations.length === 0) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    return delegations
  }

  async getDelegation(id: string): Promise<object> {
    const delegation = await Delegation.findOne({ where: { id } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!delegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    return delegation
  }
  
}