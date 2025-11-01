
import { Request, Response, NextFunction } from "express";

export interface CheckListsControllerInterface {

  //* CheckList Ambulance
  getAmbQuestions (req: Request, res: Response, next: NextFunction): void
  createAmbChecklist (req: Request, res: Response, next: NextFunction): void
  editAmbChecklist (req: Request, res: Response, next: NextFunction): void
  deleteAmbChecklist (req: Request, res: Response, next: NextFunction): void
  getAmbChecklist (req: Request, res: Response, next: NextFunction): void
  putAmbAnswers (req: Request, res: Response, next: NextFunction): void

};