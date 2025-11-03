import { Request, Response, NextFunction } from "express";
import { CheckListsControllerInterface, ERROR_CODES } from "../../domain";
import { ChecklistsService } from "../services/checklists.service";
import { AmbAnswersDto, CheckListAmbulanceEntityDto, CustomError } from "../../application";
import { toWebFile } from "../../infrastructure";


export class ChecklistsController implements CheckListsControllerInterface {

  constructor(public readonly checklistsService: ChecklistsService) { }

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

  createAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    try {
      const { ambulanceId, shiftId, km, notes } = req.body

      const files = req.files as {
        [field: string]: Express.Multer.File[]
      } | undefined

      const gasFileMf = files?.gasFile?.[0]
      const signOperatorFileMf = files?.signOperatorFile?.[0]
      const signRecipientFileMf = files?.signRecipientFile?.[0]

      const gasFile = toWebFile(gasFileMf)
      const signOperatorFile = toWebFile(signOperatorFileMf)
      const signRecipientFile = toWebFile(signRecipientFileMf)

      const payload = {
        ambulanceId,
        shiftId,
        km,
        gasFile,
        signOperatorFile,
        signRecipientFile,
        notes,
      }

      const [error, checkListAmbulanceEntityDto] = CheckListAmbulanceEntityDto.create(payload)
      if (error) throw CustomError.badRequest(error)

      this.checklistsService.createAmbChecklist(checkListAmbulanceEntityDto!)
        .then(response => res.json(response))
        .catch(err => next(CustomError.badRequest(err)))

    } catch (error) {
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR))
    }
  }

  signAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params

      const files = req.files as {
        [field: string]: Express.Multer.File[]
      } | undefined

      const signOperatorFileMf = files?.signOperatorFile?.[0]
      const signRecipientFileMf = files?.signRecipientFile?.[0]

      const signOperatorFile = toWebFile(signOperatorFileMf)
      const signRecipientFile = toWebFile(signRecipientFileMf)

      const payload = {
        id,
        signOperatorFile,
        signRecipientFile,
      }

      const [error, checkListAmbulanceEntityDto] = CheckListAmbulanceEntityDto.sign(payload)
      if (error) throw CustomError.badRequest(error)

      this.checklistsService.signAmbChecklist(checkListAmbulanceEntityDto!)
        .then(response => res.json(response))
        .catch(err => next(CustomError.badRequest(err)))

    } catch (error) {
      return next(CustomError.badRequest(ERROR_CODES.UNKNOWN_ERROR))
    }
  }

  deleteAmbChecklist(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params

    const [error, checkListAmbulanceEntityDto] = CheckListAmbulanceEntityDto.delete({ id })
    if (error) throw CustomError.badRequest(error)

    this.checklistsService.deleteAmbChecklist(checkListAmbulanceEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }

  getAmbChecklist(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }

  putAmbAnswers(req: Request, res: Response, next: NextFunction): void {
    const [error, dto] = AmbAnswersDto.fromRequest(req)
    if (error) return next(CustomError.badRequest(error))

    this.checklistsService.putAmbAnswers(dto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }
}