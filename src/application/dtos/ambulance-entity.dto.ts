import { ERROR_CODES } from "../../domain"
import { regularExp } from "../../infrastructure"


type AmbulanceDtoProps = {
  id?: string
  number?: string
  brand?: string
  model?: string
  delegationId?: string
}

export class AmbulanceEntityDto {
  readonly id?: string
  readonly number?: string
  readonly brand?: string
  readonly model?: string
  readonly delegationId?: string

  private constructor (props: AmbulanceDtoProps){
    Object.assign(this, props)
  }

  static create(object: {[key: string]: any}): [string?, AmbulanceEntityDto?] {
    const { number, brand, model, delegationId } = object

    if (!number) return [ERROR_CODES.MISSING_NUMBER]
    if (!brand) return [ERROR_CODES.MISSING_BRAND]
    if (!model) return [ERROR_CODES.MISSING_MODEL]
    if (!delegationId) return [ERROR_CODES.MISSING_DELEGATION_ID]
    
    return [undefined, new AmbulanceEntityDto({number, brand, model, delegationId})]
  }

  static edit(object: {[key: string]: any}): [string?, AmbulanceEntityDto?] {
    const { id, number, brand, model, delegationId } = object

    if (!id) return [ERROR_CODES.MISSING_AMBULANCE_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_AMBULANCE_ID]
    if (!number) return [ERROR_CODES.MISSING_NUMBER]
    if (!brand) return [ERROR_CODES.MISSING_BRAND]
    if (!model) return [ERROR_CODES.MISSING_MODEL]
    if (!delegationId) return [ERROR_CODES.MISSING_DELEGATION_ID]

  
    return [undefined, new AmbulanceEntityDto({id, number, brand, model, delegationId})]
  }

  static delete(object: {[key: string]: any}): [string?, AmbulanceEntityDto?] {
    const { id } = object

    if (!id) return [ERROR_CODES.MISSING_AMBULANCE_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_AMBULANCE_ID]

    return [undefined, new AmbulanceEntityDto({id})]
  }

}