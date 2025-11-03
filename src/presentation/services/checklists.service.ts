import { promises as fs } from 'fs';

import { ChecklistsServiceInterface, ERROR_CODES } from "../../domain";
import { ChecklistAmbulance, getCurrentTime, Question, relToAbs, saveWebFile, sequelize, Shift } from "../../infrastructure";
import { CheckListAmbulanceEntityDto } from '../../application';
import { Transaction } from 'sequelize';
import { RequestAnswerInterface } from '../../infrastructure/http/interfaces';
import Answer from '../../infrastructure/models/store/sequelize/checklist/answer-model.store';
import AnswerComponent from '../../infrastructure/models/store/sequelize/checklist/answer-component-model.store';



export class ChecklistsService implements ChecklistsServiceInterface {

  //* QUESTIONS
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

  //* AMBULANCE CHECKLIST
  async createAmbChecklist(checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto) {
    const { ambulanceId, shiftId, km, gasFile, notes } = checkListAmbulanceEntityDto

    const baseDir = 'uploads/ambulance';
    const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;

    const saved: { absPath: string; relPath: string }[] = [];

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const gas = await saveWebFile(gasFile!, baseDir, subDir);
      saved.push({ absPath: gas.absPath, relPath: gas.relPath });

      const checklist = await ChecklistAmbulance.create({
        ambulance_id: ambulanceId!,
        shift_id: shiftId!,
        time: getCurrentTime(),
        km: Number(km!),
        notes: notes ?? undefined,
        gas_path: gas.relPath
      }, { transaction: tx })

      await Shift.update({
        checklist_ambulance_id: checklist.id
      }, { where: { id: shiftId }, transaction: tx })

      await tx?.commit()

      return {
        success: true,
        data: checklist
      }
    } catch (err) {
      await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
      await tx?.rollback()
      throw ERROR_CODES.INSERT_FAILED
    }
  }

  async signAmbChecklist(checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto) {
    const { id, signOperatorFile, signRecipientFile } = checkListAmbulanceEntityDto

    const checklist = await ChecklistAmbulance.findOne({ where: { id }, attributes: ['ambulance_id'] })
    if (!checklist) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND

    const { ambulance_id: ambulanceId } = checklist

    const baseDir = 'uploads/ambulance';
    const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;

    const saved: { absPath: string; relPath: string }[] = [];

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const signOp = await saveWebFile(signOperatorFile!, baseDir, subDir);
      saved.push({ absPath: signOp.absPath, relPath: signOp.relPath });

      const signRec = await saveWebFile(signRecipientFile!, baseDir, subDir);
      saved.push({ absPath: signRec.absPath, relPath: signRec.relPath });

      await ChecklistAmbulance.update({
        sign_operator_path: signOp.relPath,
        sign_recipient_path: signRec.relPath
      }, { where: { id }, transaction: tx })

      await tx?.commit()

      return {
        success: true,
        data: {
          signOperatorPath: signOp.relPath,
          signRecipientPath: signRec.relPath
        }
      }
    } catch (err) {
      await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
      await tx?.rollback()
      throw ERROR_CODES.UPDATE_FAILED
    }
  }

  async deleteAmbChecklist(checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto) {
    const { id } = checkListAmbulanceEntityDto

    let tx: Transaction | undefined
    try {
      tx = await sequelize.transaction()

      const checklist = await ChecklistAmbulance.findOne({
        where: { id },
        attributes: ['gas_path', 'sign_operator_path', 'sign_recipient_path'],
        transaction: tx
      })

      const saved: { absPath: string }[] = []

      if (checklist?.gas_path) saved.push({ absPath: relToAbs(checklist?.gas_path) })
      if (checklist?.sign_operator_path) saved.push({ absPath: relToAbs(checklist?.sign_operator_path) })
      if (checklist?.sign_recipient_path) saved.push({ absPath: relToAbs(checklist?.sign_recipient_path) })

      await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))

      const row = await ChecklistAmbulance.destroy({ where: { id }, transaction: tx })
      if (row === 0) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND

      tx.commit()

      return { success: true }
    } catch (error) {
      tx?.rollback()
      throw ERROR_CODES.DELETE_FAILED
    }


  }

  getAmbChecklist(_id: string) {
    throw new Error("Method not implemented.");
  }

  async putAmbAnswers(object: RequestAnswerInterface) {
    const { checklistAmbulanceId, answers } = object

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()
      for (const ans of answers) {
        const questionId = ans.questionId
  
        const [answer] = await Answer.findOrCreate({
          where: {
            checklist_ambulance_id: checklistAmbulanceId,
            question_id: questionId
          },
          defaults: {
            checklist_ambulance_id: checklistAmbulanceId,
            question_id: questionId
          },
          transaction: tx
        })
  
        await AnswerComponent.create({
          answer_id: answer.id,
          type: ans.type,
          value_bool: ans.valueBool ?? null,
          value_option: ans.valueOption ?? null,
          value_text: ans.valueText ?? null
        }, { transaction: tx })
      }
      await tx?.commit()
    } catch (error) {
      await tx?.rollback()
      throw ERROR_CODES.INSERT_FAILED 
    }
  }


}