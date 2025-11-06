import { Transaction } from "sequelize";
import { GuardsEntityDto } from "../../application";
import { ERROR_CODES, GuardsServiceInterface } from "../../domain";
import { Ambulance, ChecklistAmbulance, ChecklistSupply, Delegation, Guard, sequelize, Shift, User } from "../../infrastructure";


export class GuardsService implements GuardsServiceInterface {

  private async existsGuard(date: string, delegationId: string): Promise<boolean> {
    const exists = await Guard.findOne({ where: { delegation_id: delegationId, date } })
    if (exists) return true

    return false
  }

  async createGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { guardChief, delegationId, date } = guardEntityDto

    const existsGuardChief = await User.findOne({ where: { id: guardChief, role: 'head_guard' } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsGuardChief) throw ERROR_CODES.USER_NOT_GUARD_CHIEF

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND

    const exists = await this.existsGuard(date!, delegationId!)
    if (exists) throw ERROR_CODES.GUARD_ALREADY_EXISTS

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const guard = await Guard.create({
        date: new Date(date!),
        guard_chief: guardChief,
        state: 'Nueva',
        delegation_id: delegationId,
      }, { transaction: tx })

      await tx.commit()

      const formatGuard = {
        id: guard.id,
        guardChief: {
          id: guard.guard_chief,
        },
        date: guard.date,
        delegation: {
          id: guard.delegation_id
        }
      }

      return {
        success: true,
        data: formatGuard
      }

    } catch (error) {
      tx?.rollback()
      if (typeof error === 'string') throw error
      throw { code: ERROR_CODES.INSERT_FAILED }
    }

  }

  async editGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { id, guardChief, date, delegationId, state } = guardEntityDto

    const existsGuardChief = await User.findOne({ where: { id: guardChief, role: 'head_guard' } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsGuardChief) throw ERROR_CODES.USER_NOT_GUARD_CHIEF

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      await Guard.update({
        guard_chief: guardChief,
        delegation_id: delegationId,
        date: new Date(date!),
        state: state
      }, { where: { id }, transaction: tx })

      await tx.commit()

      return { success: true }

    } catch (error) {
      tx?.rollback()
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UPDATE_FAILED
    }

  }

  async deleteGuard(id: string): Promise<object> {
    try {
      const guard = await Guard.findOne({
        where: { id },
        attributes: ['state']
      })

      if (!guard?.state) throw ERROR_CODES.GUARD_NOT_FOUND
      if (guard.state !== 'Nueva') throw ERROR_CODES.STATE_NOT_ALLOWED

      const row = await Guard.destroy({ where: { id } })
      if (row === 0) throw ERROR_CODES.GUARD_NOT_FOUND

      return { success: true }

    } catch (error) {
      if (typeof error === 'string') throw error
      throw ERROR_CODES.UNKNOWN_ERROR
    }
  }

  async getGuards(amount: string): Promise<object> {
    let formatAmount
    if (!(amount === 'all')) formatAmount = parseInt(amount)
    else formatAmount = amount


    let guards

    formatAmount === 'all'
      ? guards = await Guard.findAll({
        attributes: ['id', 'date', 'state', 'created_at', 'updated_at'],
        include: [
          { model: User, as: 'guardChief', attributes: ['id', 'name', 'lastname', 'email'] },
          { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
          {
            model: Shift,
            as: 'shifts',
            attributes: ['id', 'name', 'created_at', 'updated_at'],
            include: [
              { model: Ambulance, as: 'ambulance', attributes: ['id', 'number'] },
              { model: User, as: 'paramedical', attributes: ['id', 'name', 'lastname'] },
              { model: User, as: 'driver', attributes: ['id', 'name', 'lastname'] },
              { model: ChecklistAmbulance, as: 'checklistAmbulance' },
              { model: ChecklistSupply, as: 'checklistSupplies' },
            ]
          },
        ],
      })
      : guards = await Guard.findAll({
        attributes: ['id', 'date', 'state', 'created_at', 'updated_at'],
        include: [
          { model: User, as: 'guardChief', attributes: ['id', 'name', 'lastname', 'email'] },
          { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
        ],
        limit: formatAmount as number
      })

    if (guards.length === 0) throw ERROR_CODES.GUARD_NOT_FOUND

    return {
      success: true,
      data: guards
    }
  }

  async getOneGuard(id: string): Promise<object> {
    const guard = await Guard.findOne({
      where: { id },
      include: [
        { model: User, as: 'guardChief', attributes: ['id', 'name', 'lastname', 'email'] },
        { model: Delegation, as: 'delegation', attributes: ['id', 'name'] },
      ],
    })
      .catch(() => { throw ERROR_CODES.UNKNOWN_DB_ERROR })

    if (!guard) throw ERROR_CODES.GUARD_NOT_FOUND

    const formatGuard = {
      id: guard.id,
      date: guard.date,
      state: guard.state,
      guardChief: {
        id: guard.guardChief?.id,
        name: guard.guardChief?.name,
        lastname: guard.guardChief?.lastname,
        email: guard.guardChief?.email,
      },
      delegation: {
        id: guard.delegation?.id,
        name: guard.delegation?.name,
      }
    }

    return {
      success: true,
      data: formatGuard
    }
  }
}