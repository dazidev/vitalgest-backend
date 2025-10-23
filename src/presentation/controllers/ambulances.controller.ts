import { Request, Response, NextFunction } from "express";
import { AmbulancesControllerInterface, ERROR_CODES } from "../../domain";
import { CustomError, AmbulanceEntityDto } from "../../application";
import { regularExp } from "../../infrastructure";
import { AmbulancesService } from "../services/ambulance.service";



export class AmbulancesController implements AmbulancesControllerInterface {

  constructor(
    public readonly ambulancesService: AmbulancesService
  ){}

  createAmbulance(req: Request, res: Response, next: NextFunction): void {
    const [error, ambulanceEntityDto] = AmbulanceEntityDto.create(req.body)
    if (error) throw CustomError.badRequest(error)

    this.ambulancesService.createAmbulance(ambulanceEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }
  editAmbulance(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    const [error, ambulanceEntityDto] = AmbulanceEntityDto.edit({ id, ...req.body })
    if (error) throw CustomError.badRequest(error)

    this.ambulancesService.editAmbulance(ambulanceEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }
  deleteAmbulance(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    const [error, ambulanceEntityDto] = AmbulanceEntityDto.delete({id})
    if (error) throw CustomError.badRequest(error)

    this.ambulancesService.deleteAmbulance(ambulanceEntityDto!)
      .then(response => res.json(response))
      .catch(err => next(CustomError.badRequest(err)))
  }
  
  getAmbulances(req: Request, res: Response, next: NextFunction): void {
    const { amount } = req.params
    if (!amount) throw CustomError.badRequest(ERROR_CODES.MISSING_AMOUNT)
    
    this.ambulancesService.getAmbulances(amount)
      .then(response => res.json(response))
      .catch(error => next(CustomError.badRequest(error)))
  }

  getOneAmbulance(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_AMBULANCE_ID)
    if (!regularExp.uuid.test(id)) throw CustomError.badRequest(ERROR_CODES.INVALID_AMBULANCE_ID)

    this.ambulancesService.getOneAmbulance(id)
      .then(response => res.json(response))
      .catch(error => next(CustomError.badRequest(error)))
  }
}