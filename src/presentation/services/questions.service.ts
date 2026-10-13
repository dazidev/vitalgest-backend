import {
  Transaction,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

import {
  QuestionCategoryEntityDto,
  QuestionSubcategoryEntityDto,
} from "../../application";
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

  private handleDatabaseError(
    error: unknown,
    entity: "category" | "subcategory" = "category",
  ): never {
    if (typeof error === "string") throw error;

    if (error instanceof UniqueConstraintError) {
      if (entity === "subcategory")
        throw ERROR_CODES.QUESTION_SUBCATEGORY_CONFLICT;

      throw ERROR_CODES.QUESTION_CATEGORY_CONFLICT;
    }

    if (error instanceof ForeignKeyConstraintError) {
      if (entity === "subcategory")
        throw ERROR_CODES.QUESTION_SUBCATEGORY_HAS_QUESTIONS;

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
}
