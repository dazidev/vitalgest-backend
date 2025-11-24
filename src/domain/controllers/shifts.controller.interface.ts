import { Request, Response, NextFunction } from "express";

export interface ShiftsControllerInterface {
  createShift(req: Request, res: Response, next: NextFunction): void;
  editShift(req: Request, res: Response, next: NextFunction): void;
  deleteShift(req: Request, res: Response, next: NextFunction): void;
  getShifts(req: Request, res: Response, next: NextFunction): void;
  getOneShift(req: Request, res: Response, next: NextFunction): void;
}
