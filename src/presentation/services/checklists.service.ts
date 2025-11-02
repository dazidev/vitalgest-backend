import { promises as fs } from 'fs';

import { ChecklistsServiceInterface, ERROR_CODES } from "../../domain";
import { ChecklistAmbulance, getCurrentTime, Question, saveWebFile, sequelize } from "../../infrastructure";
import { CheckListAmbulanceEntityDto } from '../../application';
import { Transaction } from 'sequelize';



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

  async createAmbChecklist(checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto) {
    const { ambulanceId, shiftId, km, gasFile, signOperatorFile, signRecipientFile, notes } = checkListAmbulanceEntityDto

    const baseDir = 'uploads/ambulance';
    const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;

    const saved: { absPath: string; relPath: string }[] = [];

    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const gas = await saveWebFile(gasFile!, baseDir, subDir);
      saved.push({ absPath: gas.absPath, relPath: gas.relPath });

      const signOp = await saveWebFile(signOperatorFile!, baseDir, subDir);
      saved.push({ absPath: signOp.absPath, relPath: signOp.relPath });

      const signRec = await saveWebFile(signRecipientFile!, baseDir, subDir);
      saved.push({ absPath: signRec.absPath, relPath: signRec.relPath });


      const checklist = await ChecklistAmbulance.create({
        ambulance_id: ambulanceId!,
        shift_id: shiftId!,
        time: getCurrentTime(),
        km: Number(km!),
        notes: notes ?? undefined,
        gas_path: gas.relPath,
        sign_operator_path: signOp.relPath,
        sign_recipient_path: signRec.relPath
      }, { transaction: tx })

      await tx?.commit()

      return {
        success: true,
        data: checklist
      }
    } catch (err) {
      // Rollback de archivos ya escritos
      await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
      await tx?.rollback()
      throw ERROR_CODES.INSERT_FAILED
    }
  }

  editAmbChecklist(): void {
    throw new Error("Method not implemented.");
  }

  deleteAmbChecklist(_id: string): void {
    throw new Error("Method not implemented.");
  }

  getAmbChecklist(_id: string): void {
    throw new Error("Method not implemented.");
  }

  putAmbAnswers(): void {
    throw new Error("Method not implemented.");
  }


}