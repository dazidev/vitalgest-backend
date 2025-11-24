"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckListAmbulanceEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class CheckListAmbulanceEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    static validateData(ambulanceId, shiftId, km /*gasFile: File*/) {
        if (!ambulanceId)
            return domain_1.ERROR_CODES.MISSING_AMBULANCE_ID;
        if (!infrastructure_1.regularExp.uuid.test(ambulanceId))
            return domain_1.ERROR_CODES.INVALID_AMBULANCE_ID;
        if (!shiftId)
            return domain_1.ERROR_CODES.MISSING_SHIFT_ID;
        if (!infrastructure_1.regularExp.uuid.test(shiftId))
            return domain_1.ERROR_CODES.INVALID_SHIFT_ID;
        if (km === undefined || km === null || km === "")
            return domain_1.ERROR_CODES.MISSING_KM;
        const kmNum = typeof km === "number" ? km : Number(km);
        if (!Number.isFinite(kmNum) || kmNum <= 0)
            return domain_1.ERROR_CODES.INVALID_KM;
        // todo: habilitar después
        //if (!gasFile) return ERROR_CODES.MISSING_GAS_FILE
        //if (!(gasFile instanceof File)) return ERROR_CODES.INVALID_GAS_FILE
        return true;
    }
    /*private static validateSign (signOperatorFile: File, signRecipientFile: File) {
      if (!signOperatorFile) return ERROR_CODES.MISSING_SIGN_OPERATOR_FILE
      if (!(signOperatorFile instanceof File)) return ERROR_CODES.INVALID_SIGN_OPERATOR_FILE
  
      if (!signRecipientFile) return ERROR_CODES.MISSING_SIGN_RECIPIENT_FILE
      if (!(signRecipientFile instanceof File)) return ERROR_CODES.INVALID_SIGN_RECIPIENT_FILE
  
      return true
    }*/
    static create(object) {
        const { ambulanceId, shiftId, km /*gasFile,*/ } = object;
        const error = this.validateData(ambulanceId, shiftId, km /*gasFile*/);
        if (!(error === true))
            return [error];
        return [
            undefined,
            new CheckListAmbulanceEntityDto({
                ambulanceId,
                shiftId,
                km /*gasFile,*/,
            }),
        ];
    }
    static sign(object) {
        const { id, /*signOperatorFile, signRecipientFile,*/ recipientId, notes } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_AMBULANCE_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_CHECKLIST_AMBULANCE_ID];
        if (!recipientId)
            return [domain_1.ERROR_CODES.MISSING_RECIPIENT_ID];
        if (!infrastructure_1.regularExp.uuid.test(recipientId))
            return [domain_1.ERROR_CODES.INVALID_RECIPIENT_ID];
        /*const error = this.validateSign(signOperatorFile, signRecipientFile)
        if (!(error === true)) return [error]*/
        return [
            undefined,
            new CheckListAmbulanceEntityDto({
                id,
                /*signOperatorFile, signRecipientFile,*/ recipientId,
                notes,
            }),
        ];
    }
    /*static edit(object: {[key: string]: any}): [string?, CheckListAmbulanceEntityDto?] {
      const { id, ambulanceId, shiftId, km, /*gasFile,*/ /*signOperatorFile, signRecipientFile, notes } = object
    
    if (!id) return [ERROR_CODES.MISSING_CHECKLIST_AMBULANCE_ID]
    if (!regularExp.uuid.test(id)) return [ERROR_CODES.INVALID_CHECKLIST_AMBULANCE_ID]

    const error = this.validateData(ambulanceId, shiftId, km, /*gasFile*/ /*)
    if (!(error === true)) return [error]

    const errorSign = this.validateSign(signOperatorFile, signRecipientFile)
    if (!(errorSign === true)) return [errorSign]

    return [undefined, new CheckListAmbulanceEntityDto({id, ambulanceId, shiftId, km, /*gasFile,*/ /*signOperatorFile, signRecipientFile, notes})]
  }*/
    static delete(object) {
        const { id } = object;
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_CHECKLIST_AMBULANCE_ID];
        if (!infrastructure_1.regularExp.uuid.test(id))
            return [domain_1.ERROR_CODES.INVALID_CHECKLIST_AMBULANCE_ID];
        return [undefined, new CheckListAmbulanceEntityDto({ id })];
    }
}
exports.CheckListAmbulanceEntityDto = CheckListAmbulanceEntityDto;
