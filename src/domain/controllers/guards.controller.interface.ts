
import { Request, Response, NextFunction } from "express";

export interface GuardsControllerInterface {
  createGuard (req: Request, res: Response, next: NextFunction): void;
  editGuard (req: Request, res: Response, next: NextFunction): void;
  deleteGuard (req: Request, res: Response, next: NextFunction): void;
  getGuards (req: Request, res: Response, next: NextFunction): void;
  getOneGuard (req: Request, res: Response, next: NextFunction): void;
};