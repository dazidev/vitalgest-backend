import { Transaction } from "sequelize";
import { GuardsEntityDto } from "../../application";
import { ERROR_CODES, GuardsServiceInterface } from "../../domain";
import { Delegation, Guard, sequelize, User } from "../../infrastructure";


export class GuardsService implements GuardsServiceInterface {

  private async existsGuard (date: string, delegationId: string): Promise<boolean> {
    // ! todo: lo mas probable es que haya un error con la fecha
    const exists = await Guard.findOne({ where: { delegation_id: delegationId, date } }) 

    if (exists) return true
    
    return false
  }

  async createGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { guardChief, delegationId, date } = guardEntityDto

    const existsGuardChief = await User.findOne({ where: { id: guardChief, role: 'head_guard' } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsGuardChief) throw { code: ERROR_CODES.USER_NOT_GUARD_CHIEF }

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    const exists = await this.existsGuard(date!, delegationId!)
    if (exists) throw { code: ERROR_CODES.GUARD_ALREADY_EXISTS }

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const guard = await Guard.create({
        date: new Date(date!), // ! todo: verificar nuevamente el uso de las fechas
        guard_chief: guardChief,
        delegation_id: delegationId,
      })
  
      await tx.commit()
  
      return guard
      
    } catch (error) {
      tx?.rollback()
      throw { code: ERROR_CODES.INSERT_FAILED }
    }

  }

  async editGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { id, guardChief, delegationId } = guardEntityDto

    const existsGuardChief = await User.findOne({ where: { id: guardChief, role: 'head_guard' } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsGuardChief) throw { code: ERROR_CODES.USER_NOT_GUARD_CHIEF }

    const existsDelegation = await Delegation.findOne({ where: { id: delegationId } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const guard = await Guard.update({
        guard_chief: guardChief,
        delegation_id: delegationId
      }, { where: { id } })
  
      await tx.commit()
  
      return guard
      
    } catch (error) {
      tx?.rollback()
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }

  }

  async deleteGuard(id: string): Promise<object> {
    const guard = await Guard.destroy({ where: { id } })

    if (guard === 0) throw { code: ERROR_CODES.GUARD_NOT_FOUND }

    return { success: true }
  }
  
  async getGuards(amount: string): Promise<object> {
    let formatAmount
    if (!(amount === 'all')) formatAmount = parseInt(amount)
    else formatAmount = amount


    let guards

    formatAmount === 'all'
      ? guards = await Guard.findAll()
      : guards = await Guard.findAll({ limit: formatAmount as number })

    if (guards.length === 0) throw { code: ERROR_CODES.GUARD_NOT_FOUND }

    return guards
  }

  async getOneGuard(id: string): Promise<object> {
    const guard = await Guard.findOne({ where: { id } })
      .catch(() => { throw { code: ERROR_CODES.UNKNOWN_DB_ERROR } })

    if (!guard) throw { code: ERROR_CODES.GUARD_NOT_FOUND }

    return guard
  }
}