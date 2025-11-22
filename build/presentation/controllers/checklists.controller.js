"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
class ChecklistsController {
    constructor(checklistsService) {
        this.checklistsService = checklistsService;
    }
    getAmbQuestions(req, res, next) {
        const categoryStr = req.query.category;
        if (categoryStr !== undefined) {
            const catNorm = String(categoryStr).trim();
            if (!/^\d+$/.test(catNorm))
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_CATEGORY));
            const category = Number(catNorm);
            //! todo: si se van a implementar mas categorias esto debe ser diferente
            if (category < 1 || category > 9)
                return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_CATEGORY));
            this.checklistsService.getAmbQuestionPerCategory(category)
                .then((response) => res.json(response))
                .catch((err) => next(application_1.CustomError.badRequest(err)));
            return;
        }
        this.checklistsService.getAmbQuestions()
            .then((response) => res.json(response))
            .catch((err) => next(application_1.CustomError.badRequest(err)));
    }
    createAmbChecklist(req, res, next) {
        try {
            const { ambulanceId, shiftId, km } = req.body;
            // todo: habilitar después
            /*const files = req.files as {
              [field: string]: Express.Multer.File[]
            } | undefined
      
            const gasFileMf = files?.gasFile?.[0]
            const signOperatorFileMf = files?.signOperatorFile?.[0]
            const signRecipientFileMf = files?.signRecipientFile?.[0]
      
            const gasFile = toWebFile(gasFileMf)
            const signOperatorFile = toWebFile(signOperatorFileMf)
            const signRecipientFile = toWebFile(signRecipientFileMf)*/
            const payload = {
                ambulanceId,
                shiftId,
                km,
                /*gasFile,
                signOperatorFile,
                signRecipientFile,*/
            };
            const [error, checkListAmbulanceEntityDto] = application_1.CheckListAmbulanceEntityDto.create(payload);
            if (error)
                throw application_1.CustomError.badRequest(error);
            this.checklistsService.createAmbChecklist(checkListAmbulanceEntityDto)
                .then(response => res.json(response))
                .catch(err => next(application_1.CustomError.badRequest(err)));
        }
        catch (error) {
            if (typeof error === 'string')
                return next(application_1.CustomError.badRequest(error));
            return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.UNKNOWN_ERROR));
        }
    }
    signAmbChecklist(req, res, next) {
        try {
            const { id } = req.params;
            const { recipientId, notes } = req.body;
            // todo: habilitar después
            /*const files = req.files as {
              [field: string]: Express.Multer.File[]
            } | undefined
      
            const signOperatorFileMf = files?.signOperatorFile?.[0]
            const signRecipientFileMf = files?.signRecipientFile?.[0]
      
            const signOperatorFile = toWebFile(signOperatorFileMf)
            const signRecipientFile = toWebFile(signRecipientFileMf)*/
            const payload = {
                id,
                recipientId,
                notes
                // signOperatorFile,
                // signRecipientFile,
            };
            const [error, checkListAmbulanceEntityDto] = application_1.CheckListAmbulanceEntityDto.sign(payload);
            if (error)
                return next(application_1.CustomError.badRequest(error));
            this.checklistsService.signAmbChecklist(checkListAmbulanceEntityDto)
                .then(response => res.json(response))
                .catch(err => next(application_1.CustomError.badRequest(err)));
        }
        catch (error) {
            if (typeof error === 'string')
                return next(application_1.CustomError.badRequest(error));
            return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.UNKNOWN_ERROR));
        }
    }
    deleteAmbChecklist(req, res, next) {
        const { id } = req.params;
        const [error, checkListAmbulanceEntityDto] = application_1.CheckListAmbulanceEntityDto.delete({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.checklistsService.deleteAmbChecklist(checkListAmbulanceEntityDto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    getAmbChecklist(req, res, next) {
        const { id } = req.params;
        const [error, checkListAmbulanceEntityDto] = application_1.CheckListAmbulanceEntityDto.delete({ id });
        if (error)
            throw application_1.CustomError.badRequest(error);
        const { id: idv } = checkListAmbulanceEntityDto;
        this.checklistsService.getAmbChecklist(idv)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
    putAmbAnswers(req, res, next) {
        const [error, dto] = application_1.AmbAnswersDto.fromRequest(req);
        if (error)
            return next(application_1.CustomError.badRequest(error));
        this.checklistsService.putAmbAnswers(dto)
            .then(response => res.json(response))
            .catch(err => next(application_1.CustomError.badRequest(err)));
    }
}
exports.ChecklistsController = ChecklistsController;
