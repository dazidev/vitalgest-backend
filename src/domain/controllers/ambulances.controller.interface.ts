import { Request, Response, NextFunction } from "express";

export interface AmbulancesControllerInterface {
  createAmbulance(req: Request, res: Response, next: NextFunction): void;
  editAmbulance(req: Request, res: Response, next: NextFunction): void;
  deleteAmbulance(req: Request, res: Response, next: NextFunction): void;
  getAmbulances(req: Request, res: Response, next: NextFunction): void;
  getOneAmbulance(req: Request, res: Response, next: NextFunction): void;

  //* Supplies
  addSupply(req: Request, res: Response, next: NextFunction): void;
  editSupply(req: Request, res: Response, next: NextFunction): void;
  deleteSupply(req: Request, res: Response, next: NextFunction): void;
  getAmbSupplies(req: Request, res: Response, next: NextFunction): void;
  getOneAmbSupply(req: Request, res: Response, next: NextFunction): void;
  getAreas(req: Request, res: Response, next: NextFunction): void;
}
