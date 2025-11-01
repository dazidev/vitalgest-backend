import { ERROR_CODES } from "../../domain"
import {  regularExp } from "../../infrastructure"


type ShiftDtoProps = {
  id?: string
  name?: string
  ambulanceId?: string
  guardId?: string
  paramedicalId?: string
  driverId?: string
}

export class CheckListAmbulanceEntityDto {
  readonly id?: string
  readonly name?: string
  readonly ambulanceId?: string
  readonly guardId?: string
  readonly paramedicalId?: string
  readonly driverId?: string

  private constructor (props: ShiftDtoProps){
    Object.assign(this, props)
  }

  private static validateData (ambulanceId: string, guardId: string, paramedicalId: string, driverId: string) {
    if (!ambulanceId) return ERROR_CODES.MISSING_AMBULANCE_ID
    if (!regularExp.uuid.test(ambulanceId)) return ERROR_CODES.INVALID_AMBULANCE_ID

    if (!guardId) return ERROR_CODES.MISSING_GUARD_ID
    if (!regularExp.uuid.test(guardId)) return ERROR_CODES.INVALID_GUARD_ID

    if (!paramedicalId) return ERROR_CODES.MISSING_PARAMEDICAL_ID
    if (!regularExp.uuid.test(paramedicalId)) return ERROR_CODES.INVALID_PARAMEDICAL_ID

    if (!driverId) return ERROR_CODES.MISSING_DRIVER_ID
    if (!regularExp.uuid.test(driverId)) return ERROR_CODES.INVALID_DRIVER_ID
    return true
  }

  static create(object: {[key: string]: any}): [string?, CheckListAmbulanceEntityDto?] {
    const { ambulanceId, guardId, paramedicalId, driverId } = object
    
    const error = this.validateData(ambulanceId, guardId, paramedicalId, driverId)
    if (!(error === true)) return [error]

    return [undefined, new CheckListAmbulanceEntityDto({ambulanceId, guardId, paramedicalId, driverId})]
  }

  static edit(object: {[key: string]: any}): [string?, CheckListAmbulanceEntityDto?] {
    const { id, name, ambulanceId, guardId, paramedicalId, driverId } = object
    
    if (!id) return [ERROR_CODES.MISSING_SHIFT_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SHIFT_ID]
    if (!name) return [ERROR_CODES.MISSING_NAME]

    const error = this.validateData(ambulanceId, guardId, paramedicalId, driverId)
    if (!(error === true)) return [error]

    return [undefined, new CheckListAmbulanceEntityDto({id, name, ambulanceId, guardId, paramedicalId, driverId})]
  }

  static delete(object: {[key: string]: any}): [string?, CheckListAmbulanceEntityDto?] {
    const { id } = object

    if (!id) return [ERROR_CODES.MISSING_SHIFT_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SHIFT_ID]

    return [undefined, new CheckListAmbulanceEntityDto({id})]
  }
}