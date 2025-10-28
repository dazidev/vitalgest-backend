import { Request, Response, NextFunction } from "express";
import { ERROR_CODES, ShiftsControllerInterface } from "../../domain";
import { CustomError, GuardsEntityDto, ShiftEntityDto } from "../../application";
import { regularExp } from "../../infrastructure";
import { ShiftsService } from "../services/shifts.service";



export class ShiftsController implements ShiftsControllerInterface {

  constructor(
    public readonly shiftsService: ShiftsService
  ){}

  createShift(req: Request, res: Response, next: NextFunction): void {
    const [error, shiftEntityDto] = ShiftEntityDto.create(req.body)
    if (error) throw CustomError.badRequest(error)

    this.shiftsService.createShift(shiftEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }

  editShift(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    const [error, guardsEntityDto] = GuardsEntityDto.edit({ id, ...req.body })
    if (error) throw CustomError.badRequest(error)

    this.shiftsService.editShift(guardsEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }

  deleteShift(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    const [error, shiftEntityDto] = ShiftEntityDto.delete({id})
    if (error) throw CustomError.badRequest(error)

    this.shiftsService.deleteShift(shiftEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }
  
  getShifts(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID)
    
    this.shiftsService.getShifts(id)
      .then(response => res.json(response))
      .catch(error => next(CustomError.badRequest(error)))
  }

  getOneShift(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_GUARD_ID)
    if (!regularExp.uuid.test(id)) throw CustomError.badRequest(ERROR_CODES.INVALID_GUARD_ID)

    this.shiftsService.getOneShift(id)
      .then(response => res.json(response))
      .catch(error => next(CustomError.badRequest(error)))
  }
}