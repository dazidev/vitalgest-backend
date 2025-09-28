import { ERROR_CODES } from "../../domain"
import { v4 as uuidv4 } from 'uuid'
import { regularExp } from "../../infrastructure"


type DelegationDtoProps = {
  id?: string
  name?: string
  stateId?: number
  municipalityId?: number
  pharmacyId?: string
}

export class DelegationEntityDto {
  readonly id?: string
  readonly name?: string
  readonly stateId?: number
  readonly municipalityId?: number
  readonly pharmacyId?: string

  private constructor (props: DelegationDtoProps){
    Object.assign(this, props)
  }

  static create(object: {[key: string]: any}): [string?, DelegationEntityDto?] {
    const {name, stateId, municipalityId} = object
    
    // todo: hace falta verificar el formato de lo que viene
    if (!name) return [ERROR_CODES.MISSING_DELEGATION_NAME]
    if (!stateId) return [ERROR_CODES.MISSING_STATE_ID]
    if (!municipalityId) return [ERROR_CODES.MISSING_MUNICIPALITY]

    const id = uuidv4()
  
    return [undefined, new DelegationEntityDto({id, name, stateId, municipalityId})]
  }

  static edit(object: {[key: string]: any}): [string?, DelegationEntityDto?] {
    const {id, name, stateId, municipalityId} = object
    
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