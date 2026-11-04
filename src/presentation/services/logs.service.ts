import { Op, Transaction, WhereOptions } from "sequelize";

import { FindLogsDto, LogEntityDto } from "../../application";
import { ERROR_CODES, LogActions, LogEntities } from "../../domain";
import { Log, User } from "../../infrastructure";

type LogCategory = {
  entity: string;
  actions: string[];
};

export class LogsService {
  async create(logEntityDto: LogEntityDto, tx: Transaction): Promise<Log> {
    const { userId, affected, entity, action, description } = logEntityDto;

    const category = this.getFilters().categories.find(
      (item) => item.entity === entity,
    );

    if (!category) throw ERROR_CODES.INVALID_LOG_ENTITY;

    if (!category.actions.includes(action)) {
      throw ERROR_CODES.INVALID_LOG_ACTION;
    }

    return await Log.create(
      {
        user_id: userId,
        affected,
        entity,
        action,
        description,
      },
      { transaction: tx },
    );
  }

  async findAll(findLogsDto: FindLogsDto): Promise<object> {
    const { limit, offset, entity, action, userId, userSearch, from, to } =
      findLogsDto;

    const categories = this.getFilters().categories;

    if (action) {
      const validActions = entity
        ? (categories.find((item) => item.entity === entity)?.actions ?? [])
        : categories.flatMap((item) => item.actions);

      if (!validActions.includes(action)) {
        throw ERROR_CODES.INVALID_LOG_ACTION;
      }
    }

    const where = {
      ...(entity ? { entity } : {}),
      ...(action ? { action } : {}),
      ...(userId ? { user_id: userId } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { [Op.gte]: from } : {}),
              ...(to ? { [Op.lte]: to } : {}),
            },
          }
        : {}),
    };

    let userWhere: WhereOptions<User> | undefined;

    if (userSearch) {
      const terms = userSearch.split(/\s+/);

      userWhere = {
        [Op.and]: terms.map((term) => ({
          [Op.or]: [
            { name: { [Op.like]: `%${term}%` } },
            { lastname: { [Op.like]: `%${term}%` } },
            { email: { [Op.like]: `%${term}%` } },
          ],
        })),
      };
    }

    const { count, rows } = await Log.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastname", "email"],
          required: !!userSearch,
          ...(userWhere ? { where: userWhere } : {}),
        },
      ],
      distinct: true,
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      limit,
      offset,
    });

    const logs = rows.map((log) => ({
      id: log.id,
      userId: log.user_id,
      user: log.user
        ? {
            id: log.user.id,
            name: log.user.name,
            lastname: log.user.lastname,
            email: log.user.email,
          }
        : null,
      affected: log.affected,
      entity: log.entity,
      action: log.action,
      description: log.description,
      createdAt: log.createdAt,
    }));

    return {
      success: true,
      data: logs,
      total: count,
      limit,
      offset,
      totalPages: Math.ceil(count / limit),
    };
  }

  getFilters(): { categories: LogCategory[] } {
    return {
      categories: [
        {
          entity: LogEntities.user,
          actions: Object.values(LogActions.user),
        },
        {
          entity: LogEntities.delegation,
          actions: Object.values(LogActions.delegation),
        },
        {
          entity: LogEntities.guard,
          actions: Object.values(LogActions.guard),
        },
        {
          entity: LogEntities.shift,
          actions: Object.values(LogActions.shift),
        },
        {
          entity: LogEntities.ambulance,
          actions: [
            LogActions.ambulance.create,
            LogActions.ambulance.update,
            LogActions.ambulance.delete,
          ],
        },
        {
          entity: LogEntities.ambulanceSupply,
          actions: Object.values(LogActions.ambulance.supply),
        },
        {
          entity: LogEntities.supply,
          actions: Object.values(LogActions.supply),
        },
        {
          entity: LogEntities.ambulanceChecklist,
          actions: Object.values(LogActions.checklist.ambulance),
        },
        {
          entity: LogEntities.supplyChecklist,
          actions: Object.values(LogActions.checklist.supply),
        },
        {
          entity: LogEntities.supplyReport,
          actions: Object.values(LogActions.supplyReport),
        },
        {
          entity: LogEntities.questionCategory,
          actions: Object.values(LogActions.questions.category),
        },
        {
          entity: LogEntities.questionSubcategory,
          actions: Object.values(LogActions.questions.subcategory),
        },
        {
          entity: LogEntities.question,
          actions: Object.values(LogActions.questions.question),
        },
      ],
    };
  }
}
