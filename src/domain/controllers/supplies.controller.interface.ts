import { Request, Response, NextFunction } from "express";

export interface SuppliesControllerInterface {
  createSupply(req: Request, res: Response, next: NextFunction): void;
  editSupply(req: Request, res: Response, next: NextFunction): void;
  deleteSupply(req: Request, res: Response, next: NextFunction): void;
  getSupplies(req: Request, res: Response, next: NextFunction): void;
  getOneSupply(req: Request, res: Response, next: NextFunction): void;
}
