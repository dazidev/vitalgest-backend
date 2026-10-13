import { Request, Response, NextFunction } from "express";

export interface QuestionsControllerInterface {
  //* Categories
  getCategories(req: Request, res: Response, next: NextFunction): void;
  getCategory(req: Request, res: Response, next: NextFunction): void;
  createCategory(req: Request, res: Response, next: NextFunction): void;
  editCategory(req: Request, res: Response, next: NextFunction): void;
  deleteCategory(req: Request, res: Response, next: NextFunction): void;

  //* Subcategories
  getSubcategories(req: Request, res: Response, next: NextFunction): void;
  getSubcategory(req: Request, res: Response, next: NextFunction): void;
  createSubcategory(req: Request, res: Response, next: NextFunction): void;
  editSubcategory(req: Request, res: Response, next: NextFunction): void;
  deleteSubcategory(req: Request, res: Response, next: NextFunction): void;

  //* Questions
  getQuestions(req: Request, res: Response, next: NextFunction): void;
  getQuestion(req: Request, res: Response, next: NextFunction): void;
  createQuestion(req: Request, res: Response, next: NextFunction): void;
  editQuestion(req: Request, res: Response, next: NextFunction): void;
  deleteQuestion(req: Request, res: Response, next: NextFunction): void;
}
