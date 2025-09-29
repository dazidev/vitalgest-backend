import { ERROR_CODES } from "../../domain"
import { v4 as uuidv4 } from 'uuid'
import { regularExp } from "../../infrastructure"


type DelegationDtoProps = {
  id?: string
  name?: string
  stateId?: number
  stateName?: string
  municipalityId?: number
  municipalityName?: string
  pharmacyId?: string
}

export class DelegationEntityDto {
  readonly id?: string
  readonly name?: string
  readonly stateId?: number
  readonly stateName?: string
  readonly municipalityId?: number
  readonly municipalityName?: string
  readonly pharmacyId?: string

  private constructor (props: DelegationDtoProps){
    Object.assign(this, props)
  }

  static create(object: {[key: string]: any}): [string?, DelegationEntityDto?] {
    const { stateId, stateName, municipalityId, municipalityName } = object
    
    // todo: hace falta verificar el formato de lo que viene
    
    if (!stateId) return [ERROR_CODES.MISSING_STATE_ID]
    if (!stateName) return [ERROR_CODES.MISSING_STATE_NAME]
    if (!municipalityId) return [ERROR_CODES.MISSING_MUNICIPALITY]
    if (!municipalityName) return [ERROR_CODES.MISSING_MUNICIPALITY_NAME]

    const id = uuidv4()
    const name = `Delegación ${municipalityName}, ${stateName}`

    
    return [undefined, new DelegationEntityDto({id, name, stateId, stateName, municipalityId, municipalityName})]
  }

  static edit(object: {[key: string]: any}): [string?, DelegationEntityDto?] {
    const { id, name, stateId, municipalityId } = object

    // todo: hace falta verificar el formato de lo que viene
    if (!id) return [ERROR_CODES.MISSING_DELEGATION_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_DELEGATION_ID]
    if (!name) return [ERROR_CODES.MISSING_DELEGATION_NAME]
    if (!stateId) return [ERROR_CODES.MISSING_STATE_ID]
    if (!municipalityId) return [ERROR_CODES.MISSING_MUNICIPALITY]

  
    return [undefined, new DelegationEntityDto({id, name, stateId, municipalityId})]
  }

  static delete(object: {[key: string]: any}): [string?, DelegationEntityDto?] {
    const { id } = object

    // todo: hace falta verificar el formato de lo que viene
    if (!id) return [ERROR_CODES.MISSING_DELEGATION_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_DELEGATION_ID]

    return [undefined, new DelegationEntityDto({id})]
  }

}