import { Request, Response, NextFunction } from "express";
import { DelegationsControllerInterface, ERROR_CODES } from "../../domain";
import { DelegationsService } from '../services/delegations.service';
import { CustomError } from "../../application";



export class DelegationsController implements DelegationsControllerInterface {
  
  constructor (
    public readonly delegationsService: DelegationsService
  ) {}

  // todo: Todo lo que termine en NOT_FOUND hay que cambiarle a un estado 404
  private handleError = (error: {code: string}) => {
    if (error.code === ERROR_CODES.UNKNOWN_ERROR) return CustomError.internalServer(error.code)
    if (error.code === ERROR_CODES.TOO_MANY_REQUESTS) return CustomError.tooManyRequests(error.code)
    return CustomError.badRequest(error.code)
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
  
}