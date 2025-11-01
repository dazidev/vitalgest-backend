
export interface ChecklistsServiceInterface {
  getAmbQuestions (): Promise<object>;
  getAmbQuestionPerCategory (category: number): Promise<object>;

  createAmbChecklist (): void
  editAmbChecklist (): void
  deleteAmbChecklist (id: string): void
  getAmbChecklist (id: string): void
  putAmbAnswers (): void
};