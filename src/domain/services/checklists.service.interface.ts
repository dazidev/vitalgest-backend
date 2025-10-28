
export interface ChecklistsServiceInterface {
  getAmbQuestions (): Promise<object>;
  getAmbQuestionPerCategory (category: number): Promise<object>;
};