import {
  Transaction,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

import { QuestionCategoryEntityDto } from "../../application";
import { ERROR_CODES, QuestionsServiceInterface } from "../../domain";

import {
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

  private handleDatabaseError(error: unknown): never {
    if (typeof error === "string") throw error;

    if (error instanceof UniqueConstraintError)
      throw ERROR_CODES.QUESTION_CATEGORY_CONFLICT;

    if (error instanceof ForeignKeyConstraintError)
      throw ERROR_CODES.QUESTION_CATEGORY_HAS_DEPENDENCIES;

    console.error(error);
    throw ERROR_CODES.UNKNOWN_DB_ERROR;
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
}
