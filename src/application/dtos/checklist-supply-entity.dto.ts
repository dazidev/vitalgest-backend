import { ERROR_CODES } from "../../domain";
import { regularExp } from "../../infrastructure";

type CheckListSupplyDtoProps = {
  id?: string;
  shiftId?: string;
  signParamedicalFile?: File;
  recipientId?: string;
  signRecipientFile?: File;
  notes?: string;
};

export class CheckListSupplyEntityDto {
  readonly id?: string;
  readonly shiftId?: string;
  readonly signParamedicalFile?: File;
  readonly recipientId?: string;
  readonly signRecipientFile?: File;
  readonly notes?: string;

  private constructor(props: CheckListSupplyDtoProps) {
    Object.assign(this, props);
  }

  /*private static validateSign(signParamedicalFile: File, signRecipientFile: File) {
    if (!signParamedicalFile) return ERROR_CODES.MISSING_SIGN_OPERATOR_FILE;
    if (!(signParamedicalFile instanceof File))
      return ERROR_CODES.INVALID_SIGN_OPERATOR_FILE;

    if (!signRecipientFile) return ERROR_CODES.MISSING_SIGN_RECIPIENT_FILE;
    if (!(signRecipientFile instanceof File))
      return ERROR_CODES.INVALID_SIGN_RECIPIENT_FILE;

    return true;
  }*/

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
    const { id, /*signOperatorFile, signRecipientFile*/ recipientId, notes } =
      object;

    if (!id) return [ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
    if (!regularExp.uuid.test(id))
      return [ERROR_CODES.INVALID_CHECKLIST_SUPPLY_ID];

    if (!recipientId) return [ERROR_CODES.MISSING_RECIPIENT_ID];
    if (!regularExp.uuid.test(recipientId))
      return [ERROR_CODES.INVALID_RECIPIENT_ID];

    //const error = this.validateSign(signOperatorFile, signRecipientFile);
    //if (!(error === true)) return [error];

    return [
      undefined,
      new CheckListSupplyEntityDto({
        id,
        /*signOperatorFile, signRecipientFile*/ recipientId,
        notes,
      }),
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
