import { Request, Response, NextFunction } from "express";
import { AdmServiceInterface } from "../../domain/services/adm.service.interface";

export class AdmService implements AdmServiceInterface {
  createUser(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  editUser(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  deleteUser(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  getAllUsers(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
}