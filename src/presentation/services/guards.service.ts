import { GuardsEntityDto } from "../../application";
import { ERROR_CODES, GuardsServiceInterface } from "../../domain";
import { GuardsRepositorie } from "../../infrastructure";


export class GuardsService implements GuardsServiceInterface {
  private readonly guardsRepo: GuardsRepositorie

  constructor() {
    this.guardsRepo = new GuardsRepositorie()
  }

  private async existsGuard (date: string, delegationId: string): Promise<boolean> {

    const exists = await this.guardsRepo.existsGuard(date, delegationId)

    if (exists) return true
    
    return false
  }

  async createGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { guardChief, delegationId, date } = guardEntityDto

    const existsGuardChief = await this.guardsRepo.isGuardChief(guardChief!)
    if (!existsGuardChief) throw { code: ERROR_CODES.USER_NOT_GUARD_CHIEF }

    const existsDelegation = await this.guardsRepo.existsDelegation(delegationId!)
    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    const exists = await this.existsGuard(date!, delegationId!)
    if (exists) throw { code: ERROR_CODES.GUARD_ALREADY_EXISTS }

    const guard = await this.guardsRepo.createGuard(guardEntityDto)

    if (!guard.success) throw { code: guard.code }

    return guard
  }

  async editGuard(guardEntityDto: GuardsEntityDto): Promise<object> {
    const { guardChief, delegationId } = guardEntityDto

    const existsGuardChief = await this.guardsRepo.isGuardChief(guardChief!)
    if (!existsGuardChief) throw { code: ERROR_CODES.USER_NOT_GUARD_CHIEF }

    const existsDelegation = await this.guardsRepo.existsDelegation(delegationId!)
    if (!existsDelegation) throw { code: ERROR_CODES.DELEGATION_NOT_FOUND }

    const guard = await this.guardsRepo.editGuard(guardEntityDto)

    if (!guard.success) throw { code: guard.code }

    return guard
  }

  async deleteGuard(id: string): Promise<object> {
    const guard = await this.guardsRepo.deleteGuard(id)

    if (!guard.success) throw { code: guard.code }

    return guard
  }
  
  async getGuards(amount: string): Promise<object> {
    let formatAmount
    if (!(amount === 'all')) formatAmount = parseInt(amount)
    else formatAmount = amount


    const guards = await this.guardsRepo.getGuards(formatAmount)

    if (!guards.success) return { code: guards.code } // todo: revisar porque no se envia el success: false

    return guards
  }

  async getOneGuard(id: string): Promise<object> {
    const guard = await this.guardsRepo.getOneGuard(id)
    if (!guard.success) throw { code: guard.code }

    return guard
  }
}