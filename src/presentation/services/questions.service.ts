import {
  Transaction,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

import {
  LogEntityDto,
  PaginationDto,
  QuestionCategoryEntityDto,
  QuestionEntityDto,
  QuestionSubcategoryEntityDto,
} from "../../application";
import {
  ERROR_CODES,
  LogActions,
  LogEntities,
  QuestionsServiceInterface,
} from "../../domain";

import {
  Answer,
  Question,
  QuestionCategory,
  QuestionSubcategory,
  sequelize,
} from "../../infrastructure";
import { LogsService } from "./logs.service";

export class QuestionsService implements QuestionsServiceInterface {
  private readonly logsService = new LogsService();

  private async getOrderedCategories(
    tx: Transaction,
  ): Promise<QuestionCategory[]> {
    return QuestionCategory.findAll({
      order: [["order", "ASC"]],
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
  }

  private async reorderCategories(
    categories: QuestionCategory[],
    tx: Transaction,
  ): Promise<void> {
    if (categories.length === 0) return;

    const maxOrder = Math.max(...categories.map((category) => category.order));

    //* Asignar órdenes temporales para evitar conflictos UNIQUE
    for (let i = 0; i < categories.length; i++) {
      await categories[i].update(
        { order: maxOrder + i + 1 },
        { transaction: tx },
      );
    }

    //* Asignar órdenes definitivos
    for (let i = 0; i < categories.length; i++) {
      await categories[i].update({ order: i + 1 }, { transaction: tx });
    }
  }

  private handleDatabaseError(
    error: unknown,
    entity: "category" | "subcategory" | "question" = "category",
  ): never {
    if (typeof error === "string") throw error;

    if (error instanceof UniqueConstraintError) {
      if (entity === "subcategory")
        throw ERROR_CODES.QUESTION_SUBCATEGORY_CONFLICT;

      if (entity === "question") throw ERROR_CODES.QUESTION_CONFLICT;

      throw ERROR_CODES.QUESTION_CATEGORY_CONFLICT;
    }

    if (error instanceof ForeignKeyConstraintError) {
      if (entity === "subcategory")
        throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;

      if (entity === "question") throw ERROR_CODES.QUESTION_CONFLICT;

      throw ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES;
    }

    console.error(error);
    throw ERROR_CODES.UNKNOWN_DB_ERROR;
  }

  private async getOrderedSubcategories(
    categoryId: string,
    tx: Transaction,
  ): Promise<QuestionSubcategory[]> {
    return QuestionSubcategory.findAll({
      where: { category_id: categoryId },
      order: [["order", "ASC"]],
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
  }

  private async reorderSubcategories(
    subcategories: QuestionSubcategory[],
    tx: Transaction,
  ): Promise<void> {
    if (subcategories.length === 0) return;

    const maxOrder = Math.max(...subcategories.map((item) => item.order));

    for (let i = 0; i < subcategories.length; i++) {
      await subcategories[i].update(
        { order: maxOrder + i + 1 },
        { transaction: tx },
      );
    }

    for (let i = 0; i < subcategories.length; i++) {
      await subcategories[i].update({ order: i + 1 }, { transaction: tx });
    }
  }

  private async getGroupQuestions(
    categoryId: string,
    subcategoryId: string | null,
    tx: Transaction,
  ): Promise<Question[]> {
    return Question.findAll({
      where: {
        category_id: categoryId,
        subcategory_id: subcategoryId,
      },
      order: [
        ["order_question_category", "ASC"],
        ["id", "ASC"],
      ],
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
  }

  private async reorderQuestions(
    questions: Question[],
    tx: Transaction,
  ): Promise<void> {
    for (let i = 0; i < questions.length; i++) {
      const newOrder = i + 1;

      if (questions[i].order_question_category !== newOrder) {
        await questions[i].update(
          { order_question_category: newOrder },
          { transaction: tx },
        );
      }
    }
  }

  private formatQuestion(question: Question): object {
    return {
      ...question.toJSON(),
      name_category: question.category?.name ?? null,
      order_category: question.category?.order ?? null,
      name_subcategory: question.subcategory?.name ?? null,
      order_subcategory: question.subcategory?.order ?? null,
    };
  }

  //* CATEGORIES

  async getCategories(): Promise<object> {
    try {
      const categories = await QuestionCategory.findAll({
        order: [["order", "ASC"]],
      });

      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getCategory(id: string): Promise<object> {
    try {
      const category = await QuestionCategory.findByPk(id);

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async createCategory(
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object> {
    const { name } = categoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const categories = await this.getOrderedCategories(tx);

      const exists = await QuestionCategory.findOne({
        where: { name: name! },
        transaction: tx,
      });

      if (exists) {
        throw ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS;
      }

      const nextOrder =
        categories.length === 0
          ? 1
          : categories[categories.length - 1].order + 1;

      const category = await QuestionCategory.create(
        {
          name: name!,
          order: nextOrder,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: category.id,
        entity: LogEntities.questionCategory,
        action: LogActions.questions.category.create,
        description:
          `Se creó la categoría de preguntas ${category.name}. ` +
          `Orden asignado: ${category.order}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error);
    }
  }

  async editCategory(
    categoryDto: QuestionCategoryEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, name, order } = categoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const categories = await this.getOrderedCategories(tx);

      const category = categories.find((item) => item.id === id);

      if (!category) {
        throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      if (name !== undefined && name !== category.name) {
        const exists = await QuestionCategory.findOne({
          where: { name },
          transaction: tx,
        });

        if (exists && exists.id !== id) {
          throw ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS;
        }
      }

      if (order !== undefined && order > categories.length) {
        throw ERROR_CODES.INVALID_QUESTION_CATEGORY_ORDER;
      }

      const previousName = category.name;
      const previousOrder = category.order;

      const nameChanged = name !== undefined && name !== previousName;

      const orderChanged = order !== undefined && order !== previousOrder;

      if (!nameChanged && !orderChanged) {
        await tx.commit();
        tx = undefined;

        return {
          success: true,
          data: category,
        };
      }

      if (orderChanged) {
        const reorderedCategories = categories.filter((item) => item.id !== id);

        reorderedCategories.splice(order! - 1, 0, category);

        await this.reorderCategories(reorderedCategories, tx);
      }

      if (nameChanged) {
        await category.update({ name: name! }, { transaction: tx });
      }

      const changes: string[] = [];

      if (nameChanged) {
        changes.push(`nombre: ${previousName} -> ${name}`);
      }

      if (orderChanged) {
        changes.push(`orden: ${previousOrder} -> ${order}`);
      }

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: category.id,
        entity: LogEntities.questionCategory,
        action: LogActions.questions.category.update,
        description:
          `Se editó la categoría de preguntas ${previousName}. ` +
          `Cambios: ${changes.join("; ")}.` +
          (orderChanged
            ? " Se reorganizaron las posiciones de las categorías afectadas."
            : ""),
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error);
    }
  }

  async deleteCategory(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const categories = await this.getOrderedCategories(tx);

      const category = categories.find((item) => item.id === id);

      if (!category) {
        throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      const questionsCount = await Question.count({
        where: { category_id: id },
        transaction: tx,
      });

      const subcategoriesCount = await QuestionSubcategory.count({
        where: { category_id: id },
        transaction: tx,
      });

      if (questionsCount > 0 || subcategoriesCount > 0) {
        throw ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES;
      }

      const previousName = category.name;
      const previousOrder = category.order;

      await category.destroy({ transaction: tx });

      const remainingCategories = categories.filter((item) => item.id !== id);

      await this.reorderCategories(remainingCategories, tx);

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: id,
        entity: LogEntities.questionCategory,
        action: LogActions.questions.category.delete,
        description:
          `Se eliminó la categoría de preguntas ${previousName}. ` +
          `Orden anterior: ${previousOrder}. ` +
          `Se reorganizaron las categorías restantes.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error);
    }
  }

  //* SUBCATEGORIES

  async getSubcategories(categoryId?: string): Promise<object> {
    try {
      if (categoryId !== undefined) {
        const category = await QuestionCategory.findByPk(categoryId);

        if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      const subcategories = await QuestionSubcategory.findAll({
        ...(categoryId ? { where: { category_id: categoryId } } : {}),
        include: [
          {
            model: QuestionCategory,
            as: "category",
            attributes: ["id", "name", "order"],
          },
        ],
        order: [
          [{ model: QuestionCategory, as: "category" }, "order", "ASC"],
          ["order", "ASC"],
        ],
      });

      return {
        success: true,
        data: subcategories,
      };
    } catch (error) {
      this.handleDatabaseError(error, "subcategory");
    }
  }

  async getSubcategory(id: string): Promise<object> {
    try {
      const subcategory = await QuestionSubcategory.findByPk(id, {
        include: [
          {
            model: QuestionCategory,
            as: "category",
            attributes: ["id", "name", "order"],
          },
        ],
      });

      if (!subcategory) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

      return {
        success: true,
        data: subcategory,
      };
    } catch (error) {
      this.handleDatabaseError(error, "subcategory");
    }
  }

  async createSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object> {
    const { categoryId, name } = subcategoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const category = await QuestionCategory.findByPk(categoryId!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      const subcategories = await this.getOrderedSubcategories(categoryId!, tx);

      const exists = subcategories.some((item) => item.name === name);

      if (exists) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_ALREADY_EXISTS;
      }

      const nextOrder =
        subcategories.length === 0
          ? 1
          : subcategories[subcategories.length - 1].order + 1;

      const subcategory = await QuestionSubcategory.create(
        {
          category_id: categoryId!,
          name: name!,
          order: nextOrder,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: subcategory.id,
        entity: LogEntities.questionSubcategory,
        action: LogActions.questions.subcategory.create,
        description:
          `Se creó la subcategoría ${subcategory.name}. ` +
          `Categoría: ${category.name} (${category.id}). ` +
          `Orden asignado: ${subcategory.order}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: subcategory,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error, "subcategory");
    }
  }

  async editSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, categoryId, name, order } = subcategoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await QuestionSubcategory.findByPk(id!, {
        transaction: tx,
      });

      if (!original) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
      }

      const sourceCategoryId = original.category_id;
      const targetCategoryId = categoryId ?? sourceCategoryId;

      const categoryIds = [
        ...new Set([sourceCategoryId, targetCategoryId]),
      ].sort();

      for (const currentId of categoryIds) {
        const category = await QuestionCategory.findByPk(currentId, {
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!category) {
          throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
        }
      }

      const subcategory = await QuestionSubcategory.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!subcategory) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
      }

      if (subcategory.category_id !== sourceCategoryId) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_CONFLICT;
      }

      // Guardar los valores anteriores antes de modificarlos.
      const previousName = subcategory.name;
      const previousOrder = subcategory.order;
      const previousCategoryId = subcategory.category_id;

      const movingCategory = sourceCategoryId !== targetCategoryId;
      const targetName = name ?? subcategory.name;

      const targetSubcategories = await this.getOrderedSubcategories(
        targetCategoryId,
        tx,
      );

      const duplicate = targetSubcategories.some(
        (item) => item.id !== subcategory.id && item.name === targetName,
      );

      if (duplicate) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_ALREADY_EXISTS;
      }

      if (movingCategory) {
        const questionsCount = await Question.count({
          where: { subcategory_id: id! },
          transaction: tx,
        });

        if (questionsCount > 0) {
          throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;
        }

        const sourceSubcategories = await this.getOrderedSubcategories(
          sourceCategoryId,
          tx,
        );

        const destinationOrder = order ?? targetSubcategories.length + 1;

        if (
          destinationOrder < 1 ||
          destinationOrder > targetSubcategories.length + 1
        ) {
          throw ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ORDER;
        }

        const temporaryOrder =
          targetSubcategories.length === 0
            ? 1
            : targetSubcategories[targetSubcategories.length - 1].order + 1;

        await subcategory.update(
          {
            category_id: targetCategoryId,
            name: targetName,
            order: temporaryOrder,
          },
          { transaction: tx },
        );

        // Reorganizar la categoría de origen.
        const remainingSource = sourceSubcategories.filter(
          (item) => item.id !== id,
        );

        await this.reorderSubcategories(remainingSource, tx);

        // Reorganizar la categoría de destino.
        const reorderedDestination = [...targetSubcategories];

        reorderedDestination.splice(destinationOrder - 1, 0, subcategory);

        await this.reorderSubcategories(reorderedDestination, tx);
      } else {
        // Actualización del nombre.
        if (name !== undefined && name !== subcategory.name) {
          await subcategory.update({ name }, { transaction: tx });
        }

        // Actualización del orden.
        if (order !== undefined) {
          if (order > targetSubcategories.length) {
            throw ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ORDER;
          }

          if (subcategory.order !== order) {
            const reordered = targetSubcategories.filter(
              (item) => item.id !== id,
            );

            reordered.splice(order - 1, 0, subcategory);

            await this.reorderSubcategories(reordered, tx);
          }
        }
      }

      // Construir el log utilizando los valores finales.
      const changes: string[] = [];

      if (previousName !== subcategory.name) {
        changes.push(`nombre: ${previousName} -> ${subcategory.name}`);
      }

      if (previousCategoryId !== subcategory.category_id) {
        changes.push(
          `categoría: ${previousCategoryId} -> ${subcategory.category_id}`,
        );
      }

      if (previousOrder !== subcategory.order) {
        changes.push(`orden: ${previousOrder} -> ${subcategory.order}`);
      }

      if (changes.length > 0) {
        const [logError, logDto] = LogEntityDto.create({
          userId,
          affected: subcategory.id,
          entity: LogEntities.questionSubcategory,
          action: LogActions.questions.subcategory.update,
          description:
            `Se editó la subcategoría ${previousName}. ` +
            `Cambios: ${changes.join("; ")}.` +
            (movingCategory
              ? " Se reorganizaron las subcategorías de las categorías de origen y destino."
              : previousOrder !== subcategory.order
                ? " Se reorganizaron las posiciones dentro de la categoría."
                : ""),
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: subcategory,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error, "subcategory");
    }
  }

  async deleteSubcategory(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await QuestionSubcategory.findByPk(id, {
        transaction: tx,
      });

      if (!original) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
      }

      const category = await QuestionCategory.findByPk(original.category_id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!category) {
        throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      const subcategories = await this.getOrderedSubcategories(
        original.category_id,
        tx,
      );

      const subcategory = subcategories.find((item) => item.id === id);

      if (!subcategory) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
      }

      const questionsCount = await Question.count({
        where: { subcategory_id: id },
        transaction: tx,
      });

      if (questionsCount > 0) {
        throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;
      }

      const previousName = subcategory.name;
      const previousOrder = subcategory.order;
      const previousCategoryId = subcategory.category_id;

      await subcategory.destroy({ transaction: tx });

      const remaining = subcategories.filter((item) => item.id !== id);

      await this.reorderSubcategories(remaining, tx);

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: id,
        entity: LogEntities.questionSubcategory,
        action: LogActions.questions.subcategory.delete,
        description:
          `Se eliminó la subcategoría ${previousName}. ` +
          `Categoría: ${category.name} (${previousCategoryId}). ` +
          `Orden anterior: ${previousOrder}. ` +
          `Se reorganizaron las subcategorías restantes.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      this.handleDatabaseError(error, "subcategory");
    }
  }

  //* QUESTIONS

  async getQuestions(
    paginationDto: PaginationDto,
    categoryId?: string,
    subcategoryId?: string,
  ): Promise<object> {
    const { limit, offset } = paginationDto;

    try {
      const { count, rows: questions } = await Question.findAndCountAll({
        where: {
          ...(categoryId !== undefined ? { category_id: categoryId } : {}),
          ...(subcategoryId !== undefined
            ? { subcategory_id: subcategoryId }
            : {}),
        },
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
          ["id", "ASC"],
        ],
        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
        distinct: true,
      });

      return {
        success: true,
        data: questions.map((question) => this.formatQuestion(question)),
        total: count,
      };
    } catch (error) {
      this.handleDatabaseError(error, "question");
    }
  }

  async getQuestion(id: string): Promise<object> {
    try {
      const question = await Question.findByPk(id, {
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
      });

      if (!question) throw ERROR_CODES.QUESTION_NOT_FOUND;

      return {
        success: true,
        data: this.formatQuestion(question),
      };
    } catch (error) {
      this.handleDatabaseError(error, "question");
    }
  }

  async createQuestion(
    questionDto: QuestionEntityDto,
    userId: string,
  ): Promise<object> {
    const { question, categoryId, subcategoryId, typeResponse } = questionDto;

    let tx: Transaction | undefined;
    let createdId = "";

    try {
      tx = await sequelize.transaction();

      //* Bloquear categoría para controlar inserciones
      const category = await QuestionCategory.findByPk(categoryId!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      //* Validar relación de subcategoría
      if (subcategoryId) {
        const subcategory = await QuestionSubcategory.findByPk(subcategoryId, {
          transaction: tx,
        });

        if (!subcategory) {
          throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
        }

        if (subcategory.category_id !== categoryId) {
          throw ERROR_CODES.QUESTION_SUBCATEGORY_CATEGORY_MISMATCH;
        }
      }

      const groupQuestions = await this.getGroupQuestions(
        categoryId!,
        subcategoryId ?? null,
        tx,
      );

      const nextOrder =
        groupQuestions.length === 0
          ? 1
          : Math.max(
              ...groupQuestions.map((item) => item.order_question_category),
            ) + 1;

      const newQuestion = await Question.create(
        {
          question: question!,
          category_id: categoryId!,
          subcategory_id: subcategoryId ?? null,
          order_question_category: nextOrder,
          type_response: typeResponse!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: newQuestion.id,
        entity: LogEntities.question,
        action: LogActions.questions.question.create,
        description:
          `Se creó la pregunta "${newQuestion.question}". ` +
          `Categoría: ${newQuestion.category_id}. ` +
          `Subcategoría: ${newQuestion.subcategory_id ?? "Sin subcategoría"}. ` +
          `Tipo de respuesta: ${newQuestion.type_response}. ` +
          `Orden asignado: ${newQuestion.order_question_category}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      createdId = newQuestion.id;

      await tx.commit();
      tx = undefined;
    } catch (error) {
      if (tx) {
        try {
          await tx.rollback();
        } catch (rollbackError) {
          console.error("Error al revertir la transacción:", rollbackError);
        }
      }

      this.handleDatabaseError(error, "question");
    }

    return this.getQuestion(createdId);
  }

  async editQuestion(
    questionDto: QuestionEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, question, categoryId, subcategoryId, typeResponse, order } =
      questionDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await Question.findByPk(id!, {
        transaction: tx,
      });

      if (!original) throw ERROR_CODES.QUESTION_NOT_FOUND;

      const sourceCategoryId = original.category_id;
      const sourceSubcategoryId = original.subcategory_id;

      const targetCategoryId = categoryId ?? sourceCategoryId;

      const targetSubcategoryId =
        subcategoryId !== undefined
          ? subcategoryId
          : targetCategoryId !== sourceCategoryId
            ? null
            : sourceSubcategoryId;

      const categoryIds = [
        ...new Set([sourceCategoryId, targetCategoryId]),
      ].sort();

      //* Bloquear las categorías involucradas
      for (const currentId of categoryIds) {
        const category = await QuestionCategory.findByPk(currentId, {
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      const current = await Question.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!current) throw ERROR_CODES.QUESTION_NOT_FOUND;

      if (
        current.category_id !== sourceCategoryId ||
        current.subcategory_id !== sourceSubcategoryId
      ) {
        throw ERROR_CODES.QUESTION_CONFLICT;
      }

      //* Conservar valores anteriores para el log
      const previousQuestion = current.question;
      const previousCategoryId = current.category_id;
      const previousSubcategoryId = current.subcategory_id;
      const previousTypeResponse = current.type_response;
      const previousOrder = current.order_question_category;

      //* Conservar validación de respuestas existentes
      const answersCount = await Answer.count({
        where: { question_id: id! },
        transaction: tx,
      });

      if (answersCount > 0) {
        throw ERROR_CODES.QUESTION_HAS_ANSWERS;
      }

      //* Validar relación con la subcategoría
      if (targetSubcategoryId !== null) {
        const subcategory = await QuestionSubcategory.findByPk(
          targetSubcategoryId,
          { transaction: tx },
        );

        if (!subcategory) {
          throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;
        }

        if (subcategory.category_id !== targetCategoryId) {
          throw ERROR_CODES.QUESTION_SUBCATEGORY_CATEGORY_MISMATCH;
        }
      }

      const sourceQuestions = await this.getGroupQuestions(
        sourceCategoryId,
        sourceSubcategoryId,
        tx,
      );

      const movingGroup =
        sourceCategoryId !== targetCategoryId ||
        sourceSubcategoryId !== targetSubcategoryId;

      if (movingGroup) {
        const targetQuestions = await this.getGroupQuestions(
          targetCategoryId,
          targetSubcategoryId,
          tx,
        );

        const newPosition = order ?? targetQuestions.length + 1;

        if (newPosition < 1 || newPosition > targetQuestions.length + 1) {
          throw ERROR_CODES.INVALID_QUESTION_ORDER;
        }

        const temporaryOrder =
          targetQuestions.length === 0
            ? 1
            : Math.max(
                ...targetQuestions.map((item) => item.order_question_category),
              ) + 1;

        await current.update(
          {
            category_id: targetCategoryId,
            subcategory_id: targetSubcategoryId,
            order_question_category: temporaryOrder,
            ...(question !== undefined ? { question } : {}),
            ...(typeResponse !== undefined
              ? { type_response: typeResponse }
              : {}),
          },
          { transaction: tx },
        );

        //* Reorganizar grupo de origen
        const remainingSource = sourceQuestions.filter(
          (item) => item.id !== id,
        );

        await this.reorderQuestions(remainingSource, tx);

        //* Reorganizar grupo de destino
        const reorderedTarget = [...targetQuestions];

        reorderedTarget.splice(newPosition - 1, 0, current);

        await this.reorderQuestions(reorderedTarget, tx);
      } else {
        await current.update(
          {
            ...(question !== undefined ? { question } : {}),
            ...(typeResponse !== undefined
              ? { type_response: typeResponse }
              : {}),
          },
          { transaction: tx },
        );

        if (order !== undefined) {
          if (order > sourceQuestions.length) {
            throw ERROR_CODES.INVALID_QUESTION_ORDER;
          }

          if (current.order_question_category !== order) {
            const reordered = sourceQuestions.filter((item) => item.id !== id);

            reordered.splice(order - 1, 0, current);

            await this.reorderQuestions(reordered, tx);
          }
        }
      }

      //* Construir el registro de los cambios
      const changes: string[] = [];

      if (previousQuestion !== current.question) {
        changes.push(`texto: "${previousQuestion}" -> "${current.question}"`);
      }

      if (previousCategoryId !== current.category_id) {
        changes.push(
          `categoría: ${previousCategoryId} -> ${current.category_id}`,
        );
      }

      if (previousSubcategoryId !== current.subcategory_id) {
        changes.push(
          `subcategoría: ${previousSubcategoryId ?? "Sin subcategoría"} -> ` +
            `${current.subcategory_id ?? "Sin subcategoría"}`,
        );
      }

      if (previousTypeResponse !== current.type_response) {
        changes.push(
          `tipo de respuesta: ${previousTypeResponse} -> ${current.type_response}`,
        );
      }

      if (previousOrder !== current.order_question_category) {
        changes.push(
          `orden: ${previousOrder} -> ${current.order_question_category}`,
        );
      }

      //* Generar un solo log por operación
      if (changes.length > 0) {
        const [logError, logDto] = LogEntityDto.create({
          userId,
          affected: current.id,
          entity: LogEntities.question,
          action: LogActions.questions.question.update,
          description:
            `Se editó la pregunta ${current.id}. ` +
            `Cambios: ${changes.join("; ")}.` +
            (movingGroup
              ? " Se reorganizaron las preguntas de los grupos de origen y destino."
              : previousOrder !== current.order_question_category
                ? " Se reorganizaron las preguntas del grupo."
                : ""),
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      await tx.commit();
      tx = undefined;
    } catch (error) {
      if (tx) {
        try {
          await tx.rollback();
        } catch (rollbackError) {
          console.error("Error al revertir la transacción:", rollbackError);
        }
      }

      this.handleDatabaseError(error, "question");
    }

    return this.getQuestion(id!);
  }

  async deleteQuestion(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await Question.findByPk(id, {
        transaction: tx,
      });

      if (!original) throw ERROR_CODES.QUESTION_NOT_FOUND;

      const category = await QuestionCategory.findByPk(original.category_id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      const current = await Question.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!current) throw ERROR_CODES.QUESTION_NOT_FOUND;

      if (
        current.category_id !== original.category_id ||
        current.subcategory_id !== original.subcategory_id
      ) {
        throw ERROR_CODES.QUESTION_CONFLICT;
      }

      const answersCount = await Answer.count({
        where: { question_id: id },
        transaction: tx,
      });

      if (answersCount > 0) {
        throw ERROR_CODES.QUESTION_HAS_ANSWERS;
      }

      const groupQuestions = await this.getGroupQuestions(
        current.category_id,
        current.subcategory_id,
        tx,
      );

      //* Conservar información anterior
      const previousQuestion = current.question;
      const previousCategoryId = current.category_id;
      const previousSubcategoryId = current.subcategory_id;
      const previousOrder = current.order_question_category;
      const previousTypeResponse = current.type_response;

      await current.destroy({ transaction: tx });

      const remainingQuestions = groupQuestions.filter(
        (item) => item.id !== id,
      );

      await this.reorderQuestions(remainingQuestions, tx);

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: id,
        entity: LogEntities.question,
        action: LogActions.questions.question.delete,
        description:
          `Se eliminó la pregunta "${previousQuestion}". ` +
          `Categoría: ${previousCategoryId}. ` +
          `Subcategoría: ${previousSubcategoryId ?? "Sin subcategoría"}. ` +
          `Tipo de respuesta: ${previousTypeResponse}. ` +
          `Orden anterior: ${previousOrder}. ` +
          `Se reorganizaron las preguntas restantes.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) {
        try {
          await tx.rollback();
        } catch (rollbackError) {
          console.error("Error al revertir la transacción:", rollbackError);
        }
      }

      this.handleDatabaseError(error, "question");
    }
  }
}
