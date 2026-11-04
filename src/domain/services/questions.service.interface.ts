import {
  QuestionCategoryEntityDto,
  QuestionEntityDto,
  QuestionSubcategoryEntityDto,
  PaginationDto,
} from "../../application";

export interface QuestionsServiceInterface {
  //* Categories
  getCategories(): Promise<object>;
  getCategory(id: string): Promise<object>;
  createCategory(
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object>;
  editCategory(
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object>;
  deleteCategory(id: string, userId: string): Promise<object>;

  //* Subcategories
  getSubcategories(categoryId?: string): Promise<object>;
  getSubcategory(id: string): Promise<object>;
  createSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object>;
  editSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSubcategory(id: string, userId: string): Promise<object>;

  //* Questions
  getQuestions(
    paginationDto: PaginationDto,
    categoryId?: string,
    subcategoryId?: string,
  ): Promise<object>;
  getQuestion(id: string): Promise<object>;
  createQuestion(
    questionDto: QuestionEntityDto,
    userId: string,
  ): Promise<object>;
  editQuestion(questionDto: QuestionEntityDto, userId: string): Promise<object>;
  deleteQuestion(id: string, userId: string): Promise<object>;
}
