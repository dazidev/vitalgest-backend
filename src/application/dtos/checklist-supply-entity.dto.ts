import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

type CheckListSupplyDtoProps = {
  id?: string;
  shiftId?: string;
  signOperatorFile?: File;
  signRecipientFile?: File;
  notes?: string;
};

export class CheckListSupplyEntityDto {
  readonly id?: string;
  readonly shiftId?: string;
  readonly signOperatorFile?: File;
  readonly signRecipientFile?: File;
  readonly notes?: string;

  private constructor(props: CheckListSupplyDtoProps) {
    Object.assign(this, props);
  }

  private static validateSign(signOperatorFile: File, signRecipientFile: File) {
    if (!signOperatorFile) return ERROR_CODES.MISSING_SIGN_OPERATOR_FILE;
    if (!(signOperatorFile instanceof File))
      return ERROR_CODES.INVALID_SIGN_OPERATOR_FILE;

    if (!signRecipientFile) return ERROR_CODES.MISSING_SIGN_RECIPIENT_FILE;
    if (!(signRecipientFile instanceof File))
      return ERROR_CODES.INVALID_SIGN_RECIPIENT_FILE;

    return true;
  }

  static create(object: {
    [key: string]: any;
  }): [string?, CheckListSupplyEntityDto?] {
    const { shiftId } = object;

    if (!shiftId) return [ERROR_CODES.MISSING_SHIFT_ID];
    if (!regularExp.uuid.test(shiftId)) return [ERROR_CODES.INVALID_SHIFT_ID];

    return [undefined, new CheckListSupplyEntityDto({ shiftId })];
  }

  static sign(object: {
    [key: string]: any;
  }): [string?, CheckListSupplyEntityDto?] {
    const { id, signOperatorFile, signRecipientFile } = object;

    if (!id) return [ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
    if (!regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_CHECKLIST_SUPPLY_ID];

    const error = this.validateSign(signOperatorFile, signRecipientFile);
    if (!(error === true)) return [error];

    return [
      undefined,
      new CheckListSupplyEntityDto({ id, signOperatorFile, signRecipientFile }),
    ];
  }

  static delete(object: {
    [key: string]: any;
  }): [string?, CheckListSupplyEntityDto?] {
    const { id } = object;

    if (!id) return [ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
    if (!regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_CHECKLIST_SUPPLY_ID];

    return [undefined, new CheckListSupplyEntityDto({ id })];
  }
}
