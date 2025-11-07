import { ERROR_CODES } from "../../domain"
import { regularExp } from "../../infrastructure"


type SupplyDtoProps = {
  id?: string
  category?: string
  specification?: string //! todo: validar después.
  avaibleQuantity?: number
  expirationDate?: Date
  measurementUnit?: string
  pharmacyId?: string
}

export class SupplyEntityDto {
  readonly id?: string
  readonly category?: string
  readonly specification?: string
  readonly avaibleQuantity?: number
  readonly expirationDate?: Date
  readonly measurementUnit?: string
  readonly pharmacyId?: string

  private constructor(props: SupplyDtoProps) {
    Object.assign(this, props)
  }

  private static validateData(
    category: string,
    avaibleQuantity: string,
    expirationDate: string,
    measurementUnit: string,
    pharmacyId: string
  ) {
    
    if (!category) return ERROR_CODES.MISSING_CATEGORY

    if (!avaibleQuantity) return ERROR_CODES.MISSING_QUANTITY
    if (!regularExp.numIntPositive.test(avaibleQuantity)) return ERROR_CODES.INVALID_QUANTITY

    if (!expirationDate) return ERROR_CODES.MISSING_EXPIRATION_DATE
    if (!measurementUnit) return ERROR_CODES.MISSING_MEASUREMENT_UNIT

    if (!pharmacyId) return ERROR_CODES.MISSING_PHARMACY
    if (!regularExp.uuid.test(pharmacyId)) return ERROR_CODES.INVALID_PHARMACY

    return true
  }

  static create(object: { [key: string]: any }): [string?, SupplyEntityDto?] {
    const { category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId } = object

    const error = this.validateData(category, avaibleQuantity, expirationDate, measurementUnit, pharmacyId)
    if (!(error === true)) return [error]

    return [undefined, new SupplyEntityDto({ category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId })]
  }

  static edit(object: { [key: string]: any }): [string?, SupplyEntityDto?] {
    const { id, category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId } = object

    if (!id) return [ERROR_CODES.MISSING_SUPPLY_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SUPPLY_ID]

    const error = this.validateData(category, avaibleQuantity, expirationDate, measurementUnit, pharmacyId)
    if (!(error === true)) return [error]

    return [undefined, new SupplyEntityDto({ id, category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId })]
  }

  static id(object: { [key: string]: any }): [string?, SupplyEntityDto?] {
    const { id } = object

    if (!id) return [ERROR_CODES.MISSING_SUPPLY_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SUPPLY_ID]

    return [undefined, new SupplyEntityDto({ id })]
  }
}