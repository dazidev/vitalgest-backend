import {
  Transaction,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

import {
  QuestionCategoryEntityDto,
  QuestionEntityDto,
  QuestionSubcategoryEntityDto,
} from "../../application";
import { ERROR_CODES, QuestionsServiceInterface } from "../../domain";

import {
  Answer,
  Question,
  QuestionCategory,
  QuestionSubcategory,
  sequelize,
} from "../../infrastructure";

export class QuestionsService implements QuestionsServiceInterface {
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

      if (exists) throw ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS;

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

      await tx.commit();

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      await tx?.rollback();
      this.handleDatabaseError(error);
    }
  }

  async editCategory(categoryDto: QuestionCategoryEntityDto): Promise<object> {
    const { id, name, order } = categoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const categories = await this.getOrderedCategories(tx);

      const category = categories.find((item) => item.id === id);

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      if (name !== undefined && name !== category.name) {
        const exists = await QuestionCategory.findOne({
          where: { name },
          transaction: tx,
        });

        if (exists && exists.id !== id)
          throw ERROR_CODES.QUESTION_CATEGORY_ALREADY_EXISTS;
      }

      if (order !== undefined) {
        if (order > categories.length)
          throw ERROR_CODES.INVALID_QUESTION_CATEGORY_ORDER;

        if (category.order !== order) {
          const reorderedCategories = categories.filter(
            (item) => item.id !== id,
          );

          reorderedCategories.splice(order - 1, 0, category);

          await this.reorderCategories(reorderedCategories, tx);
        }
      }

      if (name !== undefined && name !== category.name) {
        await category.update({ name }, { transaction: tx });
      }

      await tx.commit();

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      await tx?.rollback();
      this.handleDatabaseError(error);
    }
  }

  async deleteCategory(id: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const categories = await this.getOrderedCategories(tx);

      const category = categories.find((item) => item.id === id);

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      const questionsCount = await Question.count({
        where: { category_id: id },
        transaction: tx,
      });

      const subcategoriesCount = await QuestionSubcategory.count({
        where: { category_id: id },
        transaction: tx,
      });

      if (questionsCount > 0 || subcategoriesCount > 0)
        throw ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES;

      await category.destroy({ transaction: tx });

      const remainingCategories = categories.filter((item) => item.id !== id);

      await this.reorderCategories(remainingCategories, tx);

      await tx.commit();

      return {
        success: true,
      };
    } catch (error) {
      await tx?.rollback();
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

      if (exists) throw ERROR_CODES.QUESTION_SUBCATEGORY_ALREADY_EXISTS;

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

      await tx.commit();

      return {
        success: true,
        data: subcategory,
      };
    } catch (error) {
      await tx?.rollback();
      this.handleDatabaseError(error, "subcategory");
    }
  }

  async editSubcategory(
    subcategoryDto: QuestionSubcategoryEntityDto,
  ): Promise<object> {
    const { id, categoryId, name, order } = subcategoryDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await QuestionSubcategory.findByPk(id!, {
        transaction: tx,
      });

      if (!original) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

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

        if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;
      }

      const subcategory = await QuestionSubcategory.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!subcategory) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

      if (subcategory.category_id !== sourceCategoryId)
        throw ERROR_CODES.QUESTION_SUBCATEGORY_CONFLICT;

      const movingCategory = sourceCategoryId !== targetCategoryId;

      const targetName = name ?? subcategory.name;

      const targetSubcategories = await this.getOrderedSubcategories(
        targetCategoryId,
        tx,
      );

      const duplicate = targetSubcategories.some(
        (item) => item.id !== subcategory.id && item.name === targetName,
      );

      if (duplicate) throw ERROR_CODES.QUESTION_SUBCATEGORY_ALREADY_EXISTS;

      if (movingCategory) {
        const questionsCount = await Question.count({
          where: { subcategory_id: id! },
          transaction: tx,
        });

        if (questionsCount > 0)
          throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;

        const sourceSubcategories = await this.getOrderedSubcategories(
          sourceCategoryId,
          tx,
        );

        const destinationOrder = order ?? targetSubcategories.length + 1;

        if (
          destinationOrder < 1 ||
          destinationOrder > targetSubcategories.length + 1
        )
          throw ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ORDER;

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

        //* Reorganizar categoría de origen
        const remainingSource = sourceSubcategories.filter(
          (item) => item.id !== id,
        );

        await this.reorderSubcategories(remainingSource, tx);

        const reorderedDestination = [...targetSubcategories];

        reorderedDestination.splice(destinationOrder - 1, 0, subcategory);

        await this.reorderSubcategories(reorderedDestination, tx);
      } else {
        if (name !== undefined && name !== subcategory.name) {
          await subcategory.update({ name }, { transaction: tx });
        }

        if (order !== undefined) {
          if (order > targetSubcategories.length)
            throw ERROR_CODES.INVALID_QUESTION_SUBCATEGORY_ORDER;

          if (subcategory.order !== order) {
            const reordered = targetSubcategories.filter(
              (item) => item.id !== id,
            );

            reordered.splice(order - 1, 0, subcategory);

            await this.reorderSubcategories(reordered, tx);
          }
        }
      }

      await tx.commit();

      return {
        success: true,
        data: subcategory,
      };
    } catch (error) {
      await tx?.rollback();
      this.handleDatabaseError(error, "subcategory");
    }
  }

  async deleteSubcategory(id: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const original = await QuestionSubcategory.findByPk(id, {
        transaction: tx,
      });

      if (!original) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

      const category = await QuestionCategory.findByPk(original.category_id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!category) throw ERROR_CODES.QUESTION_CATEGORY_NOT_FOUND;

      const subcategories = await this.getOrderedSubcategories(
        original.category_id,
        tx,
      );

      const subcategory = subcategories.find((item) => item.id === id);

      if (!subcategory) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

      const questionsCount = await Question.count({
        where: { subcategory_id: id },
        transaction: tx,
      });

      if (questionsCount > 0)
        throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;

      await subcategory.destroy({ transaction: tx });

      const remaining = subcategories.filter((item) => item.id !== id);

      await this.reorderSubcategories(remaining, tx);

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();
      this.handleDatabaseError(error, "subcategory");
    }
  }

  //* QUESTIONS

  async getQuestions(
    categoryId?: string,
    subcategoryId?: string,
  ): Promise<object> {
    try {
      const questions = await Question.findAll({
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
        ],
      });

      return {
        success: true,
        data: questions.map((question) => this.formatQuestion(question)),
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

  async createQuestion(questionDto: QuestionEntityDto): Promise<object> {
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

        if (!subcategory) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

        if (subcategory.category_id !== categoryId)
          throw ERROR_CODES.QUESTION_SUBCATEGORY_CATEGORY_MISMATCH;
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

      createdId = newQuestion.id;

      await tx.commit();
    } catch (error) {
      if (tx && !tx.finished) await tx.rollback();
      this.handleDatabaseError(error, "question");
    }

    return this.getQuestion(createdId);
  }

  async editQuestion(questionDto: QuestionEntityDto): Promise<object> {
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
      )
        throw ERROR_CODES.QUESTION_CONFLICT;

      const answersCount = await Answer.count({
        where: { question_id: id! },
        transaction: tx,
      });

      if (answersCount > 0) throw ERROR_CODES.QUESTION_HAS_ANSWERS;

      if (targetSubcategoryId !== null) {
        const subcategory = await QuestionSubcategory.findByPk(
          targetSubcategoryId,
          { transaction: tx },
        );

        if (!subcategory) throw ERROR_CODES.QUESTION_SUBCATEGORY_NOT_FOUND;

        if (subcategory.category_id !== targetCategoryId)
          throw ERROR_CODES.QUESTION_SUBCATEGORY_CATEGORY_MISMATCH;
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

        if (newPosition < 1 || newPosition > targetQuestions.length + 1)
          throw ERROR_CODES.INVALID_QUESTION_ORDER;

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

        const remainingSource = sourceQuestions.filter(
          (item) => item.id !== id,
        );

        await this.reorderQuestions(remainingSource, tx);

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
          if (order > sourceQuestions.length)
            throw ERROR_CODES.INVALID_QUESTION_ORDER;

          if (current.order_question_category !== order) {
            const reordered = sourceQuestions.filter((item) => item.id !== id);

            reordered.splice(order - 1, 0, current);

            await this.reorderQuestions(reordered, tx);
          }
        }
      }

      await tx.commit();
    } catch (error) {
      if (tx && !tx.finished) await tx.rollback();
      this.handleDatabaseError(error, "question");
    }

    return this.getQuestion(id!);
  }

  async deleteQuestion(id: string): Promise<object> {
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
      )
        throw ERROR_CODES.QUESTION_CONFLICT;

      const answersCount = await Answer.count({
        where: { question_id: id },
        transaction: tx,
      });

      if (answersCount > 0) throw ERROR_CODES.QUESTION_HAS_ANSWERS;

      const groupQuestions = await this.getGroupQuestions(
        current.category_id,
        current.subcategory_id,
        tx,
      );

      await current.destroy({ transaction: tx });

      const remainingQuestions = groupQuestions.filter(
        (item) => item.id !== id,
      );

      await this.reorderQuestions(remainingQuestions, tx);

      await tx.commit();

      return {
        success: true,
      };
    } catch (error) {
      if (tx && !tx.finished) await tx.rollback();
      this.handleDatabaseError(error, "question");
    }
  }
}
