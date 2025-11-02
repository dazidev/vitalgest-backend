import { DelegationsServiceInterface } from "../../domain";
import { ERROR_CODES } from '../../domain/enums/error-codes.enum';
import { DelegationEntity } from "../../domain/entities/delegation.entity";

import { Municipality, Pharmacy, Delegation, sequelize, State } from "../../infrastructure";
import { Transaction } from 'sequelize';


export class DelegationsService implements DelegationsServiceInterface {

  async getStates(): Promise<object> {
    const states = await State.findAll()
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (states.length === 0) throw ERROR_CODES.STATES_NOT_FOUND

    const results = await Promise.all(
      states.map(async (state) => {
        const municipalities = await Municipality.findAll({
          where: { state_id: state.id },
          attributes: ['id', 'name'],
          order: [['name', 'ASC']],
        });

        return {
          id: state.id,
          name: state.name,
          municipalities: municipalities, // opcional
        };
      })
    );


    return {
      success: true,
      data: results ? results : states
    }
  }

  async getMunicipalities(state: number): Promise<object> {
    const exists = await State.findOne({ where: { id: state } })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!exists) throw ERROR_CODES.STATE_NOT_FOUND

    const municipalities = await Municipality.findAll({ where: { state_id: state } })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (municipalities.length === 0) throw ERROR_CODES.MUNICIPALITIES_NOT_FOUND

    const formatMunicipalities = municipalities.map((m) => ({
      id: m.id,
      name: m.name,
      state: {
        id: m.state_id
      }
    }))

    return formatMunicipalities
  }

  async createDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { name, stateId, stateName, municipalityId, municipalityName } = delegationEntity

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const pharmacy = await Pharmacy.create()

      const delegation = await Delegation.create({
        name: name!,
        state_id: stateId!,
        municipality_id: municipalityId!,
        pharmacy_id: pharmacy.id
      }, { transaction: tx })

      await tx.commit()

      const formatDelegation = {
        id: delegation.id,
        name: delegation.name,
        state: {
          id: delegation.state_id,
          name: stateName,
        },
        municipality: {
          id: delegation.municipality_id,
          name: municipalityName
        },
        pharmacy: {
          id: delegation.pharmacy_id
        },
        createdAt: delegation.get('createdAt') as Date,
        updatedAt: delegation.get('updatedAt') as Date,
      }

      return {
        success: true,
        data: formatDelegation
      }

    } catch (error) {
      await tx?.rollback()
      throw ERROR_CODES.INSERT_FAILED
    }
  }

  async editDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { id, name, stateId, municipalityId } = delegationEntity

    const exists = await Delegation.findOne({ where: { id } })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!exists) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const existsState = await State.findOne({ where: { id } })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsState) throw ERROR_CODES.STATE_NOT_FOUND

    const existsMunicipality = await Municipality.findOne({ where: { id } })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsMunicipality) throw ERROR_CODES.STATE_NOT_FOUND

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const delegation = await Delegation.update({
        name: name,
        state_id: stateId,
        municipality_id: municipalityId
      }, { where: { id }, transaction: tx })

      await tx.commit()

      if (!delegation) throw ERROR_CODES.UPDATE_FAILED

      return {
        success: true
      }
    } catch (error) {
      await tx?.rollback()
      throw ERROR_CODES.UPDATE_FAILED
    }
  }

  async deleteDelegation(id: string): Promise<object> {
    //! todo: eliminar luego todo lo vinculado con la farmacia y delegación.
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      await Delegation.findByPk(id, {
        include: [{ model: Pharmacy, as: 'pharmacy', attributes: ['id'] }],
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      const count = await Delegation.destroy({ where: { id }, transaction: tx })

      await Pharmacy.destroy({ where: { id }, transaction: tx })


      if (count === 0) throw ERROR_CODES.DELEGATION_NOT_FOUND

      await tx.commit()

      return { success: true }

    } catch (error) {
      await tx?.rollback()
      throw ERROR_CODES.DELETE_FAILED
    }
  }

  async getDelegations(amount: string): Promise<object> {
    let newAmount
    if (amount !== 'all') newAmount = parseInt(amount)
    else newAmount = amount

    let delegations

    newAmount === 'all'
      ? delegations = await Delegation.findAll({
        include: [
          { model: State, as: 'state', attributes: ['id', 'name'] },
          { model: Municipality, as: 'municipality', attributes: ['id', 'name'] },
          { model: Pharmacy, as: 'pharmacy', attributes: ['id'] }
        ],
        attributes: {
          exclude: ['state_id', 'municipality_id', 'pharmacy_id']
        }
      })
      : delegations = await Delegation.findAll({
        include: [
          { model: State, as: 'state', attributes: ['id', 'name'] },
          { model: Municipality, as: 'municipality', attributes: ['id', 'name'] },
          { model: Pharmacy, as: 'pharmacy', attributes: ['id'] }
        ],
        attributes: {
          exclude: ['state_id', 'municipality_id', 'pharmacy_id']
        },
        limit: newAmount as number
      })

    if (delegations.length === 0) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const formatDelegations = delegations.map((delegation) => ({
      id: delegation.id,
      name: delegation.name,
      state: delegation.state,
      municipality: delegation.municipality,
      pharmacy: delegation.pharmacy,
      createdAt: delegation.get('createdAt') as Date,
      updatedAt: delegation.get('updatedAt') as Date,
    }))

    return {
      success: true,
      data: formatDelegations
    }
  }

  async getDelegation(id: string): Promise<object> {
    const delegation = await Delegation.findOne({
      where: { id },
      include: [
        { model: State, as: 'state', attributes: ['id', 'name'] },
        { model: Municipality, as: 'municipality', attributes: ['id', 'name'] },
        { model: Pharmacy, as: 'pharmacy', attributes: ['id'] }
      ],
      attributes: {
        exclude: ['state_id', 'municipality_id', 'pharmacy_id']
      }
    })
      .catch((_error) => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!delegation) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const formatDelegation = {
      id: delegation.id,
      name: delegation.name,
      state: delegation.state,
      municipality: delegation.municipality,
      pharmacy: delegation.pharmacy,
      createdAt: delegation.get('createdAt') as Date,
      updatedAt: delegation.get('updatedAt') as Date,
    }

    return {
      success: true,
      data: formatDelegation
    }
  }

}