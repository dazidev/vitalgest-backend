"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckListSupplyEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class CheckListSupplyEntityDto {
    constructor(props) {
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
    static create(object) {
        const { shiftId } = object;
        if (!shiftId)
            return [domain_1.ERROR_CODES.MISSING_SHIFT_ID];
        if (!infrastructure_1.regularExp.uuid.test(shiftId))
            return [domain_1.ERROR_CODES.INVALID_SHIFT_ID];
        return [undefined, new CheckListSupplyEntityDto({ shiftId })];
    }
    static sign(object) {
        const { id, /*signOperatorFile, signRecipientFile*/ recipientId, notes } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_CHECKLIST_SUPPLY_ID];
        if (!recipientId)
            return [domain_1.ERROR_CODES.MISSING_RECIPIENT_ID];
        if (!infrastructure_1.regularExp.uuid.test(recipientId))
            return [domain_1.ERROR_CODES.INVALID_RECIPIENT_ID];
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
    static delete(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_SUPPLY_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_CHECKLIST_SUPPLY_ID];
        return [undefined, new CheckListSupplyEntityDto({ id })];
    }
}
exports.CheckListSupplyEntityDto = CheckListSupplyEntityDto;
