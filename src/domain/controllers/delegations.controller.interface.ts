import { Request, Response, NextFunction } from "express";

export interface DelegationsControllerInterface {
  getStates(req: Request, res: Response, next: NextFunction): void;
  getMunicipalities(req: Request, res: Response, next: NextFunction): void;

  createDelegation(req: Request, res: Response, next: NextFunction): void;
  editDelegation(req: Request, res: Response, next: NextFunction): void;
  deleteDelegation(req: Request, res: Response, next: NextFunction): void;
  getDelegations(req: Request, res: Response, next: NextFunction): void;
  getDelegation(req: Request, res: Response, next: NextFunction): void;
}
