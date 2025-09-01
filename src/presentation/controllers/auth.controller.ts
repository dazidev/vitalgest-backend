import { Request, Response, NextFunction } from "express";
import { AuthControllerInterface } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController implements AuthControllerInterface {

  constructor (
      public readonly authService: AuthService,
    ) {}

  loginUser(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  newAccessToken(_req: Request, _res: Response, _next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
}