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
}
exports.ChecklistsController = ChecklistsController;
