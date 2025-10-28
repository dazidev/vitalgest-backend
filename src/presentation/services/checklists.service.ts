import { ChecklistsServiceInterface } from "../../domain";
import { Question } from "../../infrastructure";


export class ChecklistsService implements ChecklistsServiceInterface {
  async getAmbQuestions(): Promise<object> {
    const questions = await Question.findAll({ order: ['order_category', 'order_question_category'] })
    return {
      success: true,
      data: questions
    }
  }

  async getAmbQuestionPerCategory(category: number): Promise<object> {
    const questions = await Question.findAll({ where: { order_category: category }, order: ['order_question_category'] })
    return {
      success: true,
      data: questions
    }
  }
  
}