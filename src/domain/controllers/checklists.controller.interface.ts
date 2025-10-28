
import { Request, Response, NextFunction } from "express";

export interface CheckListsControllerInterface {
  getAmbQuestions (req: Request, res: Response, next: NextFunction): void
};