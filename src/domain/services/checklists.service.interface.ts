import { AccessContext } from "../interfaces/access-context.interface";
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
  getAmbQuestions(actor: AccessContext): Promise<object>;
  getAmbQuestionPerCategory(actor: AccessContext, category: number): Promise<object>;

  createAmbChecklist(
    actor: AccessContext,
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  signAmbChecklist(
    actor: AccessContext,
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  deleteAmbChecklist(
    actor: AccessContext,
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object>;
  putAmbAnswers(
    actor: AccessContext,
    object: RequestAnswerInterface,
    userId: string,
  ): Promise<object>;
  getAmbChecklist(actor: AccessContext, id: string): Promise<object>;

  //* Checklist supplies
  createSupChecklist(
    actor: AccessContext,
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  signSupChecklist(
    actor: AccessContext,
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  deleteSupChecklist(
    actor: AccessContext,
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object>;
  putSupAnswers(
    actor: AccessContext,
    object: RequestAnswerSupInterface,
    userId: string,
  ): Promise<object>;
  getSupChecklist(actor: AccessContext, id: string): Promise<object>;
}
