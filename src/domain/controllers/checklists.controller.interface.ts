
import { Request, Response, NextFunction } from "express";

export interface CheckListsControllerInterface {

  //* CheckList Ambulance
  getAmbQuestions(req: Request, res: Response, next: NextFunction): void;

  createAmbChecklist(req: Request, res: Response, next: NextFunction): void;
  signAmbChecklist(req: Request, res: Response, next: NextFunction): void;
  deleteAmbChecklist(req: Request, res: Response, next: NextFunction): void;
  getAmbChecklist(req: Request, res: Response, next: NextFunction): void;
  putAmbAnswers(req: Request, res: Response, next: NextFunction): void;

  //* Checklist supplies
  createSupChecklist(req: Request, res: Response, next: NextFunction): void;
  signSupChecklist(req: Request, res: Response, next: NextFunction): void;
  deleteSupChecklist(req: Request, res: Response, next: NextFunction): void;
  getSupChecklist(req: Request, res: Response, next: NextFunction): void;
  putSupAnserws(req: Request, res: Response, next: NextFunction): void;

};