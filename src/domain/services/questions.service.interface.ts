import { AccessContext } from "../interfaces/access-context.interface";
import {
  QuestionCategoryEntityDto,
  QuestionEntityDto,
  QuestionSubcategoryEntityDto,
  PaginationDto,
} from "../../application";

export interface QuestionsServiceInterface {
  //* Categories
  getCategories(actor: AccessContext): Promise<object>;
  getCategory(actor: AccessContext, id: string): Promise<object>;
  createCategory(
    actor: AccessContext,
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object>;
  editCategory(
    actor: AccessContext,
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object>;
  deleteCategory(actor: AccessContext, id: string, userId: string): Promise<object>;

  //* Subcategories
  getSubcategories(actor: AccessContext, categoryId?: string): Promise<object>;
  getSubcategory(actor: AccessContext, id: string): Promise<object>;
  createSubcategory(
    actor: AccessContext,
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object>;
  editSubcategory(
    actor: AccessContext,
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSubcategory(actor: AccessContext, id: string, userId: string): Promise<object>;

  //* Questions
  getQuestions(
    actor: AccessContext,
    paginationDto: PaginationDto,
    categoryId?: string,
    subcategoryId?: string,
  ): Promise<object>;
  getQuestion(actor: AccessContext, id: string): Promise<object>;
  createQuestion(
    actor: AccessContext,
    questionDto: QuestionEntityDto,
    userId: string,
  ): Promise<object>;
  editQuestion(actor: AccessContext, questionDto: QuestionEntityDto, userId: string): Promise<object>;
  deleteQuestion(actor: AccessContext, id: string, userId: string): Promise<object>;
}
