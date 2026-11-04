//import { promises as fs } from "fs";
import {
  ChecklistsServiceInterface,
  ERROR_CODES,
  LogActions,
  LogEntities,
} from "../../domain";

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
  LogEntityDto,
} from "../../application";

import { Op, Transaction } from "sequelize";
import { LogsService } from "./logs.service";

export class ChecklistsService implements ChecklistsServiceInterface {
  private readonly logsService = new LogsService();

  //* SUPPLIES CHECKLIST

  async createSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const { shiftId } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const shift = await Shift.findOne({
        where: { id: shiftId },
        transaction: tx,
      });

      if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const exists = await ChecklistSupply.findOne({
        where: { shift_id: shiftId },
        transaction: tx,
      });

      if (exists) throw ERROR_CODES.CHECKLIST_ALREADY_EXISTS;

      const checklist = await ChecklistSupply.create(
        {
          shift_id: shiftId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.supplyChecklist,
        action: LogActions.checklist.supply.create,
        description:
          `Se creó el checklist de suministros ${checklist.id}. ` +
          `Turno: ${shift.id}. ` +
          `Ambulancia: ${shift.ambulance_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async signSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, recipientId, delivererId, notes } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistSupply.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!checklist) {
        throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;
      }

      const shift = await Shift.findByPk(checklist.shift_id, {
        attributes: ["ambulance_id"],
        transaction: tx,
      });

      const ambulanceId = shift?.ambulance_id;

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

      await checklist.update(
        {
          deliverer_id: deliverer.id,
          sign_deliverer_path: deliverer.signature,
          recipient_id: recipient.id,
          sign_recipient_path: recipient.signature,
          notes: notes ?? undefined,
        },
        { transaction: tx },
      );

      const existingReport = await SupplyReport.findOne({
        where: { checklist_id: checklist.id },
        attributes: ["id"],
        transaction: tx,
      });

      if (!existingReport) {
        const missingSupplies = await AnswerSupply.findAll({
          where: {
            checklist_id: checklist.id,
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
            checklist_id: checklist.id,
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

        const totalMissing = missingSupplies.reduce(
          (total, supply) => total + supply.required_quantity,
          0,
        );

        const [reportLogError, reportLogDto] = LogEntityDto.create({
          userId,
          affected: report.id,
          entity: LogEntities.supplyReport,
          action: LogActions.supplyReport.create,
          description:
            `Se generó el reporte de reabastecimiento ${report.id} ` +
            `al firmar el checklist ${checklist.id}. ` +
            `Ambulancia: ${ambulanceId}. ` +
            `Suministros faltantes: ${missingSupplies.length}. ` +
            `Total de unidades faltantes: ${totalMissing}. ` +
            `Estado inicial: pending.`,
        });

        if (reportLogError) throw reportLogError;

        await this.logsService.create(reportLogDto!, tx);
      }

      const [signLogError, signLogDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.supplyChecklist,
        action: LogActions.checklist.supply.sign,
        description:
          `Se registraron las firmas del checklist de suministros ` +
          `${checklist.id}. ` +
          `Ambulancia: ${ambulanceId}. ` +
          `Usuario que entrega: ${deliverer.id}. ` +
          `Usuario que recibe: ${recipient.id}. ` +
          `Observaciones proporcionadas: ${notes ? "Sí" : "No"}. ` +
          `Reporte generado en esta operación: ${
            existingReport ? "No" : "Sí"
          }.`,
      });

      if (signLogError) throw signLogError;

      await this.logsService.create(signLogDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteSupChecklist(
    checkListSupplyEntityDto: CheckListSupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const { id } = checkListSupplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistSupply.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!checklist) {
        throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;
      }

      const answersCount = await AnswerSupply.count({
        where: { checklist_id: checklist.id },
        transaction: tx,
      });

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.supplyChecklist,
        action: LogActions.checklist.supply.delete,
        description:
          `Se eliminó el checklist de suministros ${checklist.id}. ` +
          `Turno: ${checklist.shift_id}. ` +
          `Respuestas registradas: ${answersCount}. ` +
          `Firmas registradas: ${
            checklist.deliverer_id || checklist.recipient_id ? "Sí" : "No"
          }.`,
      });

      if (logError) throw logError;

      await checklist.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

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

  async putSupAnswers(
    object: RequestAnswerSupInterface,
    userId: string,
  ): Promise<object> {
    const { checklistId, answers } = object;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistSupply.findByPk(checklistId, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!checklist) throw ERROR_CODES.CHECKLIST_SUPPLY_NOT_FOUND;

      const shift = await Shift.findByPk(checklist.shift_id, {
        attributes: ["ambulance_id"],
        transaction: tx,
      });

      if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const ambulanceId = shift.ambulance_id;

      let suppliesWithShortage = 0;
      let totalMissingQuantity = 0;

      const changes: string[] = [];

      for (const ans of answers) {
        const supply = await SupplyAmbulance.findOne({
          where: {
            id: ans.supplyId,
            ambulance_id: ambulanceId,
          },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

        const minQuantity = supply.min_quantity;
        const previousQuantity = supply.avaible_quantity;
        const reportedQuantity = ans.reportedQuantity;

        const requiredQuantity = Math.max(0, minQuantity - reportedQuantity);

        if (requiredQuantity > 0) {
          suppliesWithShortage++;
          totalMissingQuantity += requiredQuantity;
        }

        await supply.update(
          {
            avaible_quantity: reportedQuantity,
          },
          { transaction: tx },
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

        // Resumen de los primeros 10 suministros procesados.
        if (changes.length < 10) {
          changes.push(
            `${supply.id}: ${previousQuantity} -> ${reportedQuantity}, ` +
              `mínimo ${minQuantity}, faltante ${requiredQuantity}`,
          );
        }
      }

      const omitted = Math.max(0, answers.length - changes.length);

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.supplyChecklist,
        action: LogActions.checklist.supply.saveAnswers,
        description:
          `Se registraron ${answers.length} respuestas ` +
          `del checklist de suministros ${checklist.id}. ` +
          `Ambulancia: ${ambulanceId}. ` +
          `Registros con faltantes: ${suppliesWithShortage}. ` +
          `Total de unidades faltantes: ${totalMissingQuantity}. ` +
          `Detalle de cantidades: ${changes.join("; ")}.` +
          (omitted > 0
            ? ` Se omitieron ${omitted} registros del detalle del log.`
            : ""),
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
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
    userId: string,
  ): Promise<object> {
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
        where: {
          ambulance_id: ambulanceId,
          shift_id: shiftId,
        },
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

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.ambulanceChecklist,
        action: LogActions.checklist.ambulance.create,
        description:
          `Se creó el checklist de ambulancia ${checklist.id}. ` +
          `Ambulancia: ${ambulance.number} (${ambulance.id}). ` +
          `Turno: ${shift.id}. ` +
          `Kilometraje: ${checklist.km}. ` +
          `Hora registrada: ${checklist.time}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: checklist,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async signAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, recipientId, delivererId, notes } = checkListAmbulanceEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistAmbulance.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!checklist) {
        throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
      }

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

      await checklist.update(
        {
          deliverer_id: deliverer.id,
          sign_deliverer_path: deliverer.signature,
          recipient_id: recipient.id,
          sign_recipient_path: recipient.signature,
          notes: notes ?? undefined,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.ambulanceChecklist,
        action: LogActions.checklist.ambulance.sign,
        description:
          `Se registraron las firmas del checklist ${checklist.id}. ` +
          `Ambulancia: ${checklist.ambulance_id}. ` +
          `Usuario que entrega: ${deliverer.id}. ` +
          `Usuario que recibe: ${recipient.id}. ` +
          `Observaciones proporcionadas: ${notes ? "Sí" : "No"}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteAmbChecklist(
    checkListAmbulanceEntityDto: CheckListAmbulanceEntityDto,
    userId: string,
  ): Promise<object> {
    const { id } = checkListAmbulanceEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistAmbulance.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!checklist) {
        throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
      }

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.ambulanceChecklist,
        action: LogActions.checklist.ambulance.delete,
        description:
          `Se eliminó el checklist de ambulancia ${checklist.id}. ` +
          `Ambulancia: ${checklist.ambulance_id}. ` +
          `Turno: ${checklist.shift_id}. ` +
          `Kilometraje: ${checklist.km}. ` +
          `Firmas registradas: ${
            checklist.deliverer_id || checklist.recipient_id ? "Sí" : "No"
          }.`,
      });

      if (logError) throw logError;

      await checklist.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

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

  async putAmbAnswers(
    object: RequestAnswerInterface,
    userId: string,
  ): Promise<object> {
    const { checklistAmbulanceId, answers } = object;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const checklist = await ChecklistAmbulance.findByPk(
        checklistAmbulanceId,
        {
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        },
      );

      if (!checklist) {
        throw ERROR_CODES.CHECKLIST_AMBULANCE_NOT_FOUND;
      }

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

      const uniqueQuestionIds = new Set(
        answers.map((answer) => answer.questionId),
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: checklist.id,
        entity: LogEntities.ambulanceChecklist,
        action: LogActions.checklist.ambulance.saveAnswers,
        description:
          `Se guardaron ${answers.length} componentes de respuesta ` +
          `correspondientes a ${uniqueQuestionIds.size} preguntas ` +
          `del checklist ${checklist.id}. ` +
          `Ambulancia: ${checklist.ambulance_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }
}
