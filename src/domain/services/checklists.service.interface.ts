import {
  CheckListAmbulanceEntityDto,
  CheckListSupplyEntityDto,
} from "../../application";
import {
  RequestAnswerInterface,
  RequestAnswerSupInterface,
} from "../../infrastructure";

export interface ChecklistsServiceInterface {
  //* Checklist ambulances
  getAmbQuestions(): Promise<object>;
  getAmbQuestionPerCategory(category: number): Promise<object>;

  createAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  signAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  deleteAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  putAmbAnswers(
    object: RequestAnswerInterface,
    userId: string,
  ): Promise<object>;
  getAmbChecklist(id: string): Promise<object>;

  //* Checklist supplies
  createSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  signSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  putSupAnswers(
    object: RequestAnswerSupInterface,
    userId: string,
  ): Promise<object>;
  getSupChecklist(id: string): Promise<object>;
}
