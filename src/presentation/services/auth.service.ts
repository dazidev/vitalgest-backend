import { Request, Response, NextFunction } from "express";
import { AuthServiceInterface } from "../../domain/services/auth.service.interface";

export class AuthService implements AuthServiceInterface {
  loginUser(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  newAccessToken(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  
}