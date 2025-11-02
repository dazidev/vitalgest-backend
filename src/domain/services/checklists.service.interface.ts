import { CheckListAmbulanceEntityDto } from "../../application";


export interface ChecklistsServiceInterface {
  getAmbQuestions (): Promise<object>;
  getAmbQuestionPerCategory (category: number): Promise<object>;

  createAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): void
  editAmbChecklist (): void
  deleteAmbChecklist (id: string): void
  getAmbChecklist (id: string): void
  putAmbAnswers (): void
};