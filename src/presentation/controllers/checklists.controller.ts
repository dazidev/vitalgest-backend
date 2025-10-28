import { Request, Response, NextFunction } from "express";
import { CheckListsControllerInterface, ERROR_CODES } from "../../domain";
import { ChecklistsService } from "../services/checklists.service";
import { CustomError } from "../../application";


export class ChecklistsController implements CheckListsControllerInterface {

  constructor( public readonly checklistsService: ChecklistsService ) {}

  getAmbQuestions(req: Request, res: Response, next: NextFunction): void {

    const categoryStr = req.query.category

    if (categoryStr !== undefined) {
      const catNorm = String(categoryStr).trim()
      if (!/^\d+$/.test(catNorm)) return next(CustomError.badRequest(ERROR_CODES.INVALID_CATEGORY))
      
      const category = Number(catNorm)

      //! todo: si se van a implementar mas categorias esto debe ser diferente
      if (category < 1 || category > 9) return next(CustomError.badRequest(ERROR_CODES.INVALID_CATEGORY))
      
      this.checklistsService.getAmbQuestionPerCategory(category)
        .then((response) => res.json(response))
        .catch((err) => next(CustomError.badRequest(err)))
      return
      
    }
    this.checklistsService.getAmbQuestions()
      .then((response) => res.json(response))
      .catch((err) => next(CustomError.badRequest(err)))
  }
  
}