import { ERROR_CODES } from "../../domain"
import { v4 as uuidv4 } from 'uuid'
import { isDateNotExpired, regularExp } from "../../infrastructure"


type GuardsDtoProps = {
  id?: string
  guardChief?: string
  date?: string
  delegationId?: string
  state?: string
}

export class GuardsEntityDto {
  readonly id?: string
  readonly guardChief?: string
  readonly date?: string
  readonly delegationId?: string
  readonly state?: string

  private constructor (props: GuardsDtoProps){
    Object.assign(this, props)
  }

  static create(object: {[key: string]: any}): [string?, GuardsEntityDto?] {
    const { guardChief, date, delegationId } = object
    
    const validDate = isDateNotExpired(new Date(date))

    if (!guardChief) return [ERROR_CODES.MISSING_GUARD_CHIEF]
    if (!regularExp.uuid.test(guardChief)) return [ERROR_CODES.INVALID_GUARD_CHIEF]
    if (!date) return [ERROR_CODES.MISSING_DATE]
    if (!validDate) return [ERROR_CODES.DATE_EXPIRED]
    if (!regularExp.date.test(date)) return [ERROR_CODES.INVALID_DATE]
    if (!delegationId) return [ERROR_CODES.MISSING_DELEGATION_ID]
    if (!regularExp.uuid.test(delegationId)) return [ERROR_CODES.INVALID_DELEGATION_ID]

    const id = uuidv4()

    
    return [undefined, new GuardsEntityDto({id, guardChief, date, delegationId})]
  }

  static edit(object: {[key: string]: any}): [string?, GuardsEntityDto?] {
    const { id, guardChief, date, delegationId, state } = object

    const validDate = isDateNotExpired(new Date(date))

    if (!id) return [ERROR_CODES.MISSING_GUARD_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_GUARD_ID]
    if (!guardChief) return [ERROR_CODES.MISSING_GUARD_CHIEF]
    if (!date) return [ERROR_CODES.MISSING_DATE]
    if (!validDate) return [ERROR_CODES.DATE_EXPIRED]
    if (!regularExp.date.test(date)) return [ERROR_CODES.INVALID_DATE]
    if (!delegationId) return [ERROR_CODES.MISSING_DELEGATION_ID]
    if (!regularExp.uuid.test(delegationId)) return [ERROR_CODES.INVALID_DELEGATION_ID]
    if (!state) return [ERROR_CODES.MISSING_STATE]

  
    return [undefined, new GuardsEntityDto({id, guardChief, date, delegationId, state})]
  }

  static delete(object: {[key: string]: any}): [string?, GuardsEntityDto?] {
    const { id } = object

    if (!id) return [ERROR_CODES.MISSING_GUARD_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_GUARD_ID]

    return [undefined, new GuardsEntityDto({id})]
  }

}