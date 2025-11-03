import { CheckListAmbulanceEntityDto } from "../../application";
import { RequestAnswerInterface } from "../../infrastructure";


export interface ChecklistsServiceInterface {
  getAmbQuestions (): Promise<object>;
  getAmbQuestionPerCategory (category: number): Promise<object>;

  createAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): void
  signAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): void
  deleteAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): void
  getAmbChecklist (id: string): void
  putAmbAnswers (object: RequestAnswerInterface): void
};