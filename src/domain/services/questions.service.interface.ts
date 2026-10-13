import {
  QuestionCategoryEntityDto,
  QuestionSubcategoryEntityDto,
} from "../../application";

export interface QuestionsServiceInterface {
  //* Categories
  getCategories(): Promise<object>;
  getCategory(id: string): Promise<object>;
  createCategory(categoryDto: QuestionCategoryEntityDto): Promise<object>;
  editCategory(categoryDto: QuestionCategoryEntityDto): Promise<object>;
  deleteCategory(id: string): Promise<object>;

  //* Subcategories
  getSubcategories(categoryId?: string): Promise<object>;
  getSubcategory(id: string): Promise<object>;
  createSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
  ): Promise<object>;
  editSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
  ): Promise<object>;
  deleteSubcategory(id: string): Promise<object>;
}
