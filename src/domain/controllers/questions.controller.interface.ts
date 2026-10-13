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
}
