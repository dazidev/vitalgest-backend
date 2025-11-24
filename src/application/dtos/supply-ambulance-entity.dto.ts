import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

type SupplyAmbDtoProps = {
  id?: string;
  avaibleQuantity?: number;
  minQuantity?: number;
  areaId?: number;
  supplyId?: string;
  ambulanceId?: string;
};

export class SupplyAmbEntityDto {
  readonly id?: string;
  readonly avaibleQuantity?: number;
  readonly minQuantity?: number;
  readonly areaId?: number;
  readonly supplyId?: string;
  readonly ambulanceId?: string;

  private constructor(props: SupplyAmbDtoProps) {
    Object.assign(this, props);
  }

  private static validateData(
    avaibleQuantity: string,
    minQuantity: string,
    areaId: string,
    ambulanceId: string
  ) {
    if (!avaibleQuantity) return ERROR_CODES.MISSING_QUANTITY;
    if (!regularExp.numIntPositive.test(avaibleQuantity))
      return ERROR_CODES.INVALID_QUANTITY;
    if (!minQuantity) return ERROR_CODES.MISSING_MIN_QUANTITY;
    if (!regularExp.numIntPositive.test(minQuantity))
      return ERROR_CODES.INVALID_MIN_QUANTITY;

    if (!areaId) return ERROR_CODES.MISSING_AREA_ID;
    if (!regularExp.numIntPositive.test(areaId))
      return ERROR_CODES.INVALID_AREA_ID;

    if (!ambulanceId) return ERROR_CODES.MISSING_AMBULANCE_ID;
    if (!regularExp.uuid.test(ambulanceId))
      return ERROR_CODES.INVALID_AMBULANCE_ID;

    return true;
  }

  static create(object: {
    [key: string]: any;
  }): [string?, SupplyAmbEntityDto?] {
    const { avaibleQuantity, minQuantity, areaId, supplyId, ambulanceId } =
      object;

    if (!supplyId) return [ERROR_CODES.MISSING_SUPPLY_ID];
    const error = this.validateData(
      avaibleQuantity,
      minQuantity,
      areaId,
      ambulanceId
    );
    if (!(error === true)) return [error];

    return [
      undefined,
      new SupplyAmbEntityDto({
        avaibleQuantity,
        minQuantity,
        areaId,
        supplyId,
        ambulanceId,
      }),
    ];
  }

  static edit(object: { [key: string]: any }): [string?, SupplyAmbEntityDto?] {
    const { id, avaibleQuantity, minQuantity, areaId, ambulanceId } = object;

    if (!id) return [ERROR_CODES.MISSING_SUPPLY_ID];
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SUPPLY_ID];

    const error = this.validateData(
      avaibleQuantity,
      minQuantity,
      areaId,
      ambulanceId
    );
    if (!(error === true)) return [error];

    return [
      undefined,
      new SupplyAmbEntityDto({
        id,
        avaibleQuantity,
        minQuantity,
        areaId,
        ambulanceId,
      }),
    ];
  }

  static id(object: { [key: string]: any }): [string?, SupplyAmbEntityDto?] {
    const { id } = object;

    if (!id) return [ERROR_CODES.MISSING_SUPPLY_ID];
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_SUPPLY_ID];

    return [undefined, new SupplyAmbEntityDto({ id })];
  }
}
