import { CheckListAmbulanceEntityDto, CheckListSupplyEntityDto } from "../../application";
import { RequestAnswerInterface } from "../../infrastructure";


export interface ChecklistsServiceInterface {
  //* Checklist ambulances
  getAmbQuestions (): Promise<object>;
  getAmbQuestionPerCategory (category: number): Promise<object>;

  createAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): Promise<object>;
  signAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): Promise<object>;
  deleteAmbChecklist (checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto): Promise<object>;
  getAmbChecklist (id: string): Promise<object>;
  putAmbAnswers (object: RequestAnswerInterface): Promise<object>;

  //* Checklist supplies
  createSupChecklist(checkListSupplyEntityDto: CheckListSupplyEntityDto): Promise<object>;
  signSupChecklist(checkListSupplyEntityDto: CheckListSupplyEntityDto): Promise<object>;
  deleteSupChecklist(checkListSupplyEntityDto: CheckListSupplyEntityDto): Promise<object>;
  getSupChecklist(id: string): Promise<object>;
  putSupAnserws(object: any): Promise<object>; // todo: tipear mejor.
};