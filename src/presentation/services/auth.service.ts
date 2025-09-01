import { Request, Response, NextFunction } from "express";
import { AuthServiceInterface } from "../../domain/services/auth.service.interface";

export class AuthService implements AuthServiceInterface {
  loginUser(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  newAccessToken(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  
}