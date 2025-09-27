import { Request, Response, NextFunction } from "express";

export interface DelegationsControllerInterface {
  getStates (req: Request, res: Response, next: NextFunction): void;
  getMunicipalities (req: Request, res: Response, next: NextFunction): void;
};