import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

type DelegationDtoProps = {
  id?: string;
  municipalityId?: number;
  pharmacyId?: string;
};

export class DelegationEntityDto {
  readonly id?: string;
  readonly municipalityId?: number;
  readonly pharmacyId?: string;

  private constructor(props: DelegationDtoProps) {
    Object.assign(this, props);
  }

  static create(object: {
    [key: string]: any;
  }): [string?, DelegationEntityDto?] {
    const { municipalityId } = object;

    if (!municipalityId) return [ERROR_CODES.MISSING_MUNICIPALITY];
    if (!regularExp.numIntPositive.test(municipalityId))
      return [ERROR_CODES.INVALID_MUNICIPALITY];

    return [undefined, new DelegationEntityDto({ municipalityId })];
  }

  static edit(object: { [key: string]: any }): [string?, DelegationEntityDto?] {
    const { id, municipalityId } = object;

    if (!id) return [ERROR_CODES.MISSING_DELEGATION_ID];
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_DELEGATION_ID];
    if (!municipalityId) return [ERROR_CODES.MISSING_MUNICIPALITY];
    if (!regularExp.numIntPositive.test(municipalityId))
      return [ERROR_CODES.INVALID_MUNICIPALITY];

    return [undefined, new DelegationEntityDto({ id, municipalityId })];
  }

  static delete(object: {
    [key: string]: any;
  }): [string?, DelegationEntityDto?] {
    const { id } = object;

    // todo: hace falta verificar el formato de lo que viene
    if (!id) return [ERROR_CODES.MISSING_DELEGATION_ID];
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_DELEGATION_ID];

    return [undefined, new DelegationEntityDto({ id })];
  }
}
