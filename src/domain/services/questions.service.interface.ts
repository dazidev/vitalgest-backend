import { QuestionCategoryEntityDto } from "../../application";

export interface QuestionsServiceInterface {
  //* Categories
  getCategories(): Promise<object>;
  getCategory(id: string): Promise<object>;
  createCategory(categoryDto: QuestionCategoryEntityDto): Promise<object>;
  editCategory(categoryDto: QuestionCategoryEntityDto): Promise<object>;
  deleteCategory(id: string): Promise<object>;
}
