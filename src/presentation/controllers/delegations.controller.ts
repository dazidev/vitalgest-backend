import { Request, Response, NextFunction } from "express";
import { DelegationsControllerInterface, ERROR_CODES } from "../../domain";
import { DelegationsService } from '../services/delegations.service';
import { CustomError, DelegationEntityDto } from "../../application";
import { regularExp } from "../../infrastructure";



export class DelegationsController implements DelegationsControllerInterface {
  
  constructor (
    public readonly delegationsService: DelegationsService
  ) {}
  
  // todo: Todo lo que termine en NOT_FOUND hay que cambiarle a un estado 404
  private handleError = (error: string) => {
    if (error === ERROR_CODES.UNKNOWN_ERROR) return CustomError.internalServer(error)
    if (error === ERROR_CODES.UNKNOWN_DB_ERROR) return CustomError.internalServer(error)
    if (error === ERROR_CODES.TOO_MANY_REQUESTS) return CustomError.tooManyRequests(error)
    return CustomError.badRequest(error)
  }

  getStates(_req: Request, res: Response, next: NextFunction): void  {
    this.delegationsService.getStates()
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)) )
  }

  getMunicipalities(req: Request, res: Response, next: NextFunction): void {
    const { stateId } = req.params
    const numberStateId = parseInt(stateId)
    if (!stateId) throw CustomError.badRequest(ERROR_CODES.MISSING_STATE_ID)
    if (typeof numberStateId !== 'number' || numberStateId <= 0) throw CustomError.badRequest(ERROR_CODES.INVALID_STATE_ID)

    this.delegationsService.getMunicipalities(parseInt(stateId))
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
  }

  createDelegation(req: Request, res: Response, next: NextFunction): void {
    const [error, delegateEntityDto] = DelegationEntityDto.create({...req.body})

    if (error) throw CustomError.badRequest(error)
    
    this.delegationsService.createDelegation(delegateEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
    
  }

  editDelegation(req: Request, res: Response, next: NextFunction): void {
    const [error, delegateEntityDto] = DelegationEntityDto.edit({...req.params, ...req.body})

    if (error) throw CustomError.badRequest(error)
    
    this.delegationsService.editDelegation(delegateEntityDto!)
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
  }
  
  deleteDelegation(req: Request, res: Response, next: NextFunction): void {
    const [error, delegateEntityDto] = DelegationEntityDto.delete({...req.params, ...req.body})

    if (error) throw CustomError.badRequest(error)
    
    const { id } = delegateEntityDto!

    this.delegationsService.deleteDelegation(id!)
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
  }

  getDelegations(req: Request, res: Response, next: NextFunction): void {
    const { amount } = req.params
    // todo: verificar que venga un número o un 'all'
    if (!amount) throw CustomError.badRequest(ERROR_CODES.MISSING_AMOUNT)

    this.delegationsService.getDelegations(amount)
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
  }

  getDelegation(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params
    if (!id) throw CustomError.badRequest(ERROR_CODES.MISSING_DELEGATION_ID)
    if (!regularExp.uuid.test(id)) throw CustomError.badRequest(ERROR_CODES.INVALID_DELEGATION_ID)
    
    this.delegationsService.getDelegation(id)
      .then((response) => res.json(response))
      .catch((err) => next(this.handleError(err)))
  }
  
}