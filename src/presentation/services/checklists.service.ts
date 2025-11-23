import { promises as fs } from "fs";

import { ChecklistsServiceInterface, ERROR_CODES } from "../../domain";
import {
  Ambulance,
  Answer,
  AnswerComponent,
  AnswerSupply,
  AreaAmbulance,
  ChecklistAmbulance,
  ChecklistSupply,
  getCurrentTime,
  Question,
  relToAbs,
  sequelize,
  Shift,
  User,
} from "../../infrastructure";
import {
  CheckListAmbulanceEntityDto,
  CheckListSupplyEntityDto,
} from "../../application";
import { Transaction } from "sequelize";
import { RequestAnswerInterface } from "../../infrastructure/http/interfaces";

export class ChecklistsService implements ChecklistsServiceInterface {
  //* SUPPLIES CHECKLIST
  async createSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto
  ): Promise<object> {
    const { shiftId } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await ChecklistSupply.findOne({
        where: { shift_id: shiftId },
        transaction: tx,
      });
      if (exists) throw ERROR_CODES.CHECKLIST_ALREADY_EXISTS;

      const checklist = await ChecklistSupply.create(
        {
          shift_id: shiftId,
        },
        { transaction: tx }
      );

      await tx.commit();

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async signSupChecklist(
    _checkListSupplyEntityDto: CheckListSupplyEntityDto
  ): Promise<object> {
    throw new Error("Method not implemented.");
  }

  async deleteSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto
  ): Promise<object> {
    const { id } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exist = await ChecklistSupply.findOne({
        where: { id },
        transaction: tx,
      });
      if (!exist) throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;

      const row = await ChecklistSupply.destroy({
        where: { id },
        transaction: tx,
      });
      if (row === 0) throw ERROR_CODES.DELETE_FAILED;

      await tx.commit();

      return {
        success: true,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getSupChecklist(id: string): Promise<object> {
    try {
      const checklist = await ChecklistSupply.findByPk(id, {
        include: [
          { model: Ambulance, as: "ambulance", attributes: ["id", "number"] },
          {
            model: AnswerSupply,
            as: "answers",
            include: [{ model: AreaAmbulance, as: "area" }],
          },
        ],
        order: [
          [
            { model: AnswerSupply, as: "answers" },
            { model: AreaAmbulance, as: "area" },
            "order",
            "ASC",
          ],
        ],
      });
      if (!checklist) throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async putSupAnserws(_object: any): Promise<object> {
    throw new Error("Method not implemented.");
  }

  //* QUESTIONS
  async getAmbQuestions(): Promise<object> {
    const questions = await Question.findAll({
      order: ["order_category", "order_question_category"],
    });
    return {
      success: true,
      data: questions,
    };
  }

  async getAmbQuestionPerCategory(category: number): Promise<object> {
    const questions = await Question.findAll({
      where: { order_category: category },
      order: ["order_question_category"],
    });
    return {
      success: true,
      data: questions,
    };
  }

  //* AMBULANCE CHECKLIST
  async createAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto
  ) {
    const { ambulanceId, shiftId, km /*gasFile,*/ } =
      checkListAmbulanceEntityDto;

    /*const baseDir = 'uploads/ambulance';
    const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;

    const saved: { absPath: string; relPath: string }[] = [];*/

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const ambulance = await Ambulance.findOne({
        where: { id: ambulanceId },
        transaction: tx,
      });
      if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const shift = await Shift.findOne({
        where: { id: shiftId },
        transaction: tx,
      });
      if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const exists = await ChecklistAmbulance.findOne({
        where: { ambulance_id: ambulanceId, shift_id: shiftId },
        transaction: tx,
      });
      if (exists) throw ERROR_CODES.CHECKLIST_ALREADY_EXISTS;

      /*const gas = await saveWebFile(gasFile!, baseDir, subDir);
      saved.push({ absPath: gas.absPath, relPath: gas.relPath });*/

      const checklist = await ChecklistAmbulance.create(
        {
          ambulance_id: ambulanceId!,
          shift_id: shiftId!,
          time: getCurrentTime(),
          km: Number(km!),
          gas_path: "sin utilizar" /*gas.relPath*/,
        },
        { transaction: tx }
      );

      await tx?.commit();

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      // await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw error; //! todo: cambiar
    }
  }

  async signAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto
  ) {
    const { id, /*signOperatorFile, signRecipientFile,*/ recipientId, notes } =
      checkListAmbulanceEntityDto;

    const checklist = await ChecklistAmbulance.findOne({
      where: { id },
      attributes: ["ambulance_id"],
    });
    if (!checklist) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;

    /*const { ambulance_id: ambulanceId } = checklist

    const baseDir = 'uploads/ambulance';
    const subDir = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}/${ambulanceId}`;

    const saved: { absPath: string; relPath: string }[] = [];*/

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      /*const signOp = await saveWebFile(signOperatorFile!, baseDir, subDir);
      saved.push({ absPath: signOp.absPath, relPath: signOp.relPath });

      const signRec = await saveWebFile(signRecipientFile!, baseDir, subDir);
      saved.push({ absPath: signRec.absPath, relPath: signRec.relPath });*/

      await ChecklistAmbulance.update(
        {
          /*sign_operator_path: signOp.relPath,
        sign_recipient_path: signRec.relPath*/
          recipient_id: recipientId,
          notes: notes ?? undefined,
        },
        { where: { id }, transaction: tx }
      );

      await tx?.commit();

      return {
        success: true,
      };
    } catch (err) {
      // await Promise.allSettled(saved.map(f => fs.unlink(f.absPath)))
      await tx?.rollback();
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto
  ) {
    const { id } = checkListAmbulanceEntityDto;

    let tx: Transaction | undefined;
    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistAmbulance.findOne({
        where: { id },
        attributes: ["gas_path", "sign_operator_path", "sign_recipient_path"],
        transaction: tx,
      });

      const saved: { absPath: string }[] = [];

      if (checklist?.gas_path)
        saved.push({ absPath: relToAbs(checklist?.gas_path) });
      if (checklist?.sign_operator_path)
        saved.push({ absPath: relToAbs(checklist?.sign_operator_path) });
      if (checklist?.sign_recipient_path)
        saved.push({ absPath: relToAbs(checklist?.sign_recipient_path) });

      await Promise.allSettled(saved.map((f) => fs.unlink(f.absPath)));

      const row = await ChecklistAmbulance.destroy({
        where: { id },
        transaction: tx,
      });
      if (row === 0) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;

      tx.commit();

      return { success: true };
    } catch (error) {
      tx?.rollback();
      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getAmbChecklist(id: string) {
    try {
      const checklist = await ChecklistAmbulance.findByPk(id, {
        attributes: { exclude: ["ambulance_id", "shift_id", "recipient_id"] },
        include: [
          { model: Ambulance, as: "ambulance", attributes: ["id"] },
          { model: Shift, as: "shift", attributes: ["id"] },
          {
            model: User,
            as: "recipient",
            attributes: ["id", "name", "lastname"],
          },
          {
            model: Answer,
            as: "answers",
            attributes: ["id"],
            include: [
              {
                model: Question,
                as: "question",
                attributes: [
                  "id",
                  "question",
                  "name_category",
                  "order_category",
                  "order_question_category",
                  "name_subcategory",
                  "order_subcategory",
                  "type_response",
                ],
              },
              {
                model: AnswerComponent,
                as: "components",
                attributes: [
                  "id",
                  "type",
                  "value_bool",
                  "value_option",
                  "value_text",
                ],
              },
            ],
          },
        ],
        order: [
          [
            { model: Answer, as: "answers" },
            { model: Question, as: "question" },
            "order_category",
            "ASC",
          ],
          [
            { model: Answer, as: "answers" },
            { model: Question, as: "question" },
            "order_question_category",
            "ASC",
          ],
        ],
      });
      if (!checklist) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      if (typeof error === "string") throw error; //! TODO: tipificar mejor?

      throw ERROR_CODES.UNKNOWN_ERROR;
    }
  }

  async putAmbAnswers(object: RequestAnswerInterface) {
    const { checklistAmbulanceId, answers } = object;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();
      for (const ans of answers) {
        const questionId = ans.questionId;

        const [answer] = await Answer.findOrCreate({
          where: {
            checklist_ambulance_id: checklistAmbulanceId,
            question_id: questionId,
          },
          defaults: {
            checklist_ambulance_id: checklistAmbulanceId,
            question_id: questionId,
          },
          transaction: tx,
        });

        await AnswerComponent.create(
          {
            answer_id: answer.id,
            type: ans.type,
            value_bool: ans.valueBool ?? null,
            value_option: ans.valueOption ?? null,
            value_text: ans.valueText ?? null,
          },
          { transaction: tx }
        );
      }
      await tx?.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw error;
    }
  }
}
