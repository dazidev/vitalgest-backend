import { Request, Response, NextFunction } from "express";
import { AdmControllerInterface } from "../../domain";
import { AdmService } from "../services/adm.service";


export class AdmController implements AdmControllerInterface {

  constructor (
    public readonly admService: AdmService,
  ) {}

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