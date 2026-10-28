//import { promises as fs } from "fs";
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
  Guard,
  Question,
  QuestionCategory,
  QuestionSubcategory,
  //relToAbs,
  RequestAnswerInterface,
  RequestAnswerSupInterface,
  sequelize,
  Shift,
  SupplyAmbulance,
  User,
  SupplyReport,
  SupplyReportItem,
} from "../../infrastructure";

import {
  CheckListAmbulanceEntityDto,
  CheckListSupplyEntityDto,
} from "../../application";

import { Op, Transaction } from "sequelize";

export class ChecklistsService implements ChecklistsServiceInterface {
  //* SUPPLIES CHECKLIST
  async createSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
  ): Promise<object> {
    const { shiftId } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const existsShift = await Shift.findOne({
        where: { id: shiftId },
        transaction: tx,
      });
      if (!existsShift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const exists = await ChecklistSupply.findOne({
        where: { shift_id: shiftId },
        transaction: tx,
      });
      if (exists) throw ERROR_CODES.CHECKLIST_ALREADY_EXISTS;

      const checklist = await ChecklistSupply.create(
        {
          shift_id: shiftId,
        },
        { transaction: tx },
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
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
  ): Promise<object> {
    const { id, recipientId, delivererId, notes } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistSupply.findOne({
        where: { id },
        include: [
          {
            model: Shift,
            as: "shift",
            attributes: ["ambulance_id"],
          },
        ],
        transaction: tx,
      });

      if (!checklist) throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;

      const ambulanceId = checklist.shift?.ambulance_id;

      if (!ambulanceId) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const deliverer = await User.findOne({
        where: { id: delivererId },
        attributes: ["id", "signature"],
        transaction: tx,
      });

      if (!deliverer) throw ERROR_CODES.INVALID_DELIVERER_ID;

      const recipient = await User.findOne({
        where: { id: recipientId },
        attributes: ["id", "signature"],
        transaction: tx,
      });

      if (!recipient) throw ERROR_CODES.INVALID_RECIPIENT_ID;

      await ChecklistSupply.update(
        {
          deliverer_id: deliverer.id,
          sign_deliverer_path: deliverer.signature,
          recipient_id: recipient.id,
          sign_recipient_path: recipient.signature,
          notes: notes ?? undefined,
        },
        {
          where: { id },
          transaction: tx,
        },
      );

      const existingReport = await SupplyReport.findOne({
        where: { checklist_id: id },
        attributes: ["id"],
        transaction: tx,
      });

      if (!existingReport) {
        const missingSupplies = await AnswerSupply.findAll({
          where: {
            checklist_id: id,
            required_quantity: {
              [Op.gt]: 0,
            },
          },
          include: [
            {
              model: AreaAmbulance,
              as: "area",
              attributes: ["id", "name", "section", "order"],
              required: true,
            },
          ],
          transaction: tx,
        });

        const report = await SupplyReport.create(
          {
            checklist_id: id!,
            ambulance_id: ambulanceId,
          },
          { transaction: tx },
        );

        if (missingSupplies.length > 0) {
          await SupplyReportItem.bulkCreate(
            missingSupplies.map((supply) => ({
              report_id: report.id,

              category: supply.category,
              specification: supply.specification,
              measurement_unit: supply.measurement_unit,

              min_quantity: supply.min_quantity,
              reported_quantity: supply.reported_quantity,
              required_quantity: supply.required_quantity,

              added_quantity: 0,
              is_resolved: false,

              area_id: Number(supply.area_id),
              area_name: supply.area!.name,
              section: supply.area!.section,
              area_order: supply.area!.order,
            })),
            { transaction: tx },
          );
        }
      }

      await tx.commit();

      return {
        success: true,
      };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
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
        attributes: [
          "id",
          "sign_deliverer_path",
          "sign_recipient_path",
          "notes",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Shift,
            as: "shift",
            attributes: ["id"],
            include: [
              {
                model: Guard,
                as: "guard",
                attributes: ["id", "date", "state"],
                include: [
                  {
                    model: User,
                    as: "guardChief",
                    attributes: ["id", "name", "lastname"],
                  },
                ],
              },
              {
                model: User,
                as: "paramedical",
                attributes: ["id", "name", "lastname"],
              },
              {
                model: User,
                as: "driver",
                attributes: ["id", "name", "lastname"],
              },
            ],
          },
          {
            model: Ambulance,
            as: "ambulance",
            attributes: ["id", "number"],
          },
          {
            model: User,
            as: "deliverer",
            attributes: ["id", "name", "lastname"],
          },
          {
            model: User,
            as: "recipient",
            attributes: ["id", "name", "lastname"],
          },
          {
            model: AnswerSupply,
            as: "answers",
            attributes: [
              "id",
              "category",
              "specification",
              "min_quantity",
              "reported_quantity",
              "required_quantity",
              "measurement_unit",
              "createdAt",
              "updatedAt",
            ],
            include: [
              {
                model: AreaAmbulance,
                as: "area",
                attributes: ["id", "name", "section", "order"],
              },
            ],
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
      console.log(error);
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async putSupAnswers(object: RequestAnswerSupInterface): Promise<object> {
    const { checklistId, answers } = object;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistSupply.findOne({
        where: { id: checklistId },
        include: [
          {
            model: Shift,
            as: "shift",
            attributes: ["ambulance_id"],
          },
        ],
        transaction: tx,
      });

      if (!checklist) throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;

      const ambulanceId = checklist.shift?.ambulance_id;

      if (!ambulanceId) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      for (const ans of answers) {
        const supply = await SupplyAmbulance.findOne({
          where: {
            id: ans.supplyId,
            ambulance_id: ambulanceId,
          },
          transaction: tx,
        });

        if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

        const minQuantity = supply.min_quantity;
        const reportedQuantity = ans.reportedQuantity;

        const requiredQuantity = Math.max(0, minQuantity - reportedQuantity);

        await SupplyAmbulance.update(
          {
            avaible_quantity: reportedQuantity,
          },
          {
            where: {
              id: supply.id,
              ambulance_id: ambulanceId,
            },
            transaction: tx,
          },
        );

        await AnswerSupply.create(
          {
            checklist_id: checklistId,
            category: supply.category,
            specification: supply.specification,
            min_quantity: minQuantity,
            reported_quantity: reportedQuantity,
            required_quantity: requiredQuantity,
            measurement_unit: supply.measurement_unit,
            area_id: Number(supply.area_id),
          },
          { transaction: tx },
        );
      }

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw error;
    }
  }

  //* QUESTIONS

  private async findAmbQuestions(categoryId?: string) {
    const questions = await Question.findAll({
      ...(categoryId ? { where: { category_id: categoryId } } : {}),
      include: [
        {
          model: QuestionCategory,
          as: "category",
          attributes: ["id", "name", "order"],
          required: true,
        },
        {
          model: QuestionSubcategory,
          as: "subcategory",
          attributes: ["id", "name", "order"],
          required: false,
        },
      ],
      order: [
        [{ model: QuestionCategory, as: "category" }, "order", "ASC"],
        [{ model: QuestionSubcategory, as: "subcategory" }, "order", "ASC"],
        ["order_question_category", "ASC"],
      ],
    });

    return questions.map((question) => ({
      ...question.toJSON(),
      name_category: question.category?.name ?? null,
      order_category: question.category?.order ?? null,
      name_subcategory: question.subcategory?.name ?? null,
      order_subcategory: question.subcategory?.order ?? null,
    }));
  }

  async getAmbQuestions(): Promise<object> {
    const questions = await this.findAmbQuestions();

    return {
      success: true,
      data: questions,
    };
  }

  async getAmbQuestionPerCategory(categoryOrder: number): Promise<object> {
    const category = await QuestionCategory.findOne({
      where: { order: categoryOrder },
      attributes: ["id"],
    });

    if (!category) {
      return {
        success: true,
        data: [],
      };
    }

    const questions = await this.findAmbQuestions(category.id);

    return {
      success: true,
      data: questions,
    };
  }

  //* AMBULANCE CHECKLIST
  async createAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
  ) {
    const { ambulanceId, shiftId, km } = checkListAmbulanceEntityDto;

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

      const checklist = await ChecklistAmbulance.create(
        {
          ambulance_id: ambulanceId!,
          shift_id: shiftId!,
          time: getCurrentTime(),
          km: Number(km!),
          gas_path: "sin utilizar",
        },
        { transaction: tx },
      );

      await tx?.commit();

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw error; //! todo: cambiar
    }
  }

  async signAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
  ) {
    const { id, recipientId, delivererId, notes } = checkListAmbulanceEntityDto;

    const checklist = await ChecklistAmbulance.findOne({
      where: { id },
      attributes: ["ambulance_id"],
    });
    if (!checklist) throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const deliverer = await User.findOne({
        where: { id: delivererId },
        attributes: ["id", "signature"],
      });
      if (!deliverer) throw ERROR_CODES.INVALID_DELIVERER_ID;

      const recipient = await User.findOne({
        where: { id: recipientId },
        attributes: ["id", "signature"],
      });
      if (!recipient) throw ERROR_CODES.INVALID_RECIPIENT_ID;

      await ChecklistAmbulance.update(
        {
          deliverer_id: deliverer.id,
          sign_deliverer_path: deliverer.signature,
          recipient_id: recipient.id,
          sign_recipient_path: recipient.signature,
          notes: notes ?? undefined,
        },
        { where: { id }, transaction: tx },
      );

      await tx?.commit();

      return {
        success: true,
      };
    } catch (err) {
      await tx?.rollback();
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
  ) {
    const { id } = checkListAmbulanceEntityDto;

    let tx: Transaction | undefined;
    try {
      tx = await sequelize.transaction();

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
          { model: Ambulance, as: "ambulance", attributes: ["id", "number"] },
          {
            model: Shift,
            as: "shift",
            attributes: ["id"],
            include: [
              {
                model: Guard,
                as: "guard",
                attributes: ["id", "date", "state"],
                include: [
                  {
                    model: User,
                    as: "guardChief",
                    attributes: ["id", "name", "lastname"],
                  },
                ],
              },
              {
                model: User,
                as: "paramedical",
                attributes: ["id", "name", "lastname"],
              },
              {
                model: User,
                as: "driver",
                attributes: ["id", "name", "lastname"],
              },
            ],
          },
          {
            model: User,
            as: "deliverer",
            attributes: ["id", "name", "lastname"],
          },
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
                  "category_id",
                  "subcategory_id",
                  "order_question_category",
                  "type_response",
                ],
                include: [
                  {
                    model: QuestionCategory,
                    as: "category",
                    attributes: ["id", "name", "order"],
                    required: true,
                  },
                  {
                    model: QuestionSubcategory,
                    as: "subcategory",
                    attributes: ["id", "name", "order"],
                    required: false,
                  },
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
            { model: QuestionCategory, as: "category" },
            "order",
            "ASC",
          ],
          [
            { model: Answer, as: "answers" },
            { model: Question, as: "question" },
            { model: QuestionSubcategory, as: "subcategory" },
            "order",
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

      const answers = (checklist.get("answers") as Answer[] | undefined) ?? [];

      const formattedAnswers = answers.map((answer) => {
        const question = answer.question;

        return {
          ...answer.toJSON(),
          question: question
            ? {
                ...question.toJSON(),
                name_category: question.category?.name ?? null,
                order_category: question.category?.order ?? null,
                name_subcategory: question.subcategory?.name ?? null,
                order_subcategory: question.subcategory?.order ?? null,
              }
            : null,
        };
      });

      return {
        success: true,
        data: {
          ...checklist.toJSON(),
          answers: formattedAnswers,
        },
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
          { transaction: tx },
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
