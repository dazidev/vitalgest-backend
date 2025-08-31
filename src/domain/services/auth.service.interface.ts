
import { Request, Response, NextFunction } from "express";

export interface AuthServiceInterface {
  loginUser (req: Request, res: Response, next: NextFunction): void;
  newAccessToken (req: Request, res: Response, next: NextFunction): void;
};