import { Request, Response, NextFunction } from "express";
import { AuthControllerInterface } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController implements AuthControllerInterface {

  constructor (
      public readonly authService: AuthService,
    ) {}

  loginUser(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
  newAccessToken(req: Request, res: Response, next: NextFunction): void {
    throw new Error("Method not implemented.");
  }
}