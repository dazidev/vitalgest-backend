import { Request, Response, NextFunction } from "express";

export interface QuestionsControllerInterface {
  //* Categories
  getCategories(req: Request, res: Response, next: NextFunction): void;

  getCategory(req: Request, res: Response, next: NextFunction): void;

  createCategory(req: Request, res: Response, next: NextFunction): void;

  editCategory(req: Request, res: Response, next: NextFunction): void;

  deleteCategory(req: Request, res: Response, next: NextFunction): void;
}
