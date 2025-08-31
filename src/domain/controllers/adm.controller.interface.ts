
import { Request, Response, NextFunction } from "express";

export interface AdmControllerInterface {
  createUser (req: Request, res: Response, next: NextFunction): void;
  editUser (req: Request, res: Response, next: NextFunction): void;
  deleteUser (req: Request, res: Response, next: NextFunction): void;
  getAllUsers (req: Request, res: Response, next: NextFunction): void;
};