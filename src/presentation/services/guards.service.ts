import { Transaction, UniqueConstraintError } from "sequelize";
import {
  GuardsEntityDto,
  LogEntityDto,
  PaginationDto,
} from "../../application";
import {
  ERROR_CODES,
  GuardsServiceInterface,
  LogActions,
  LogEntities,
} from "../../domain";
import {
  Ambulance,
  ChecklistAmbulance,
  ChecklistSupply,
  Delegation,
  Guard,
  sequelize,
  Shift,
  User,
} from "../../infrastructure";
import { LogsService } from "./logs.service";

export class GuardsService implements GuardsServiceInterface {
  private readonly logsService = new LogsService();

  private async existsGuard(
    date: string,
    delegationId: string,
  ): Promise<boolean> {
    const exists = await Guard.findOne({
      where: { delegation_id: delegationId, date },
    });
    if (exists) return true;

    return false;
  }

  async createGuard(
    guardEntityDto: GuardsEntityDto,
    userId: string,
  ): Promise<object> {
    const { guardChief, delegationId, date } = guardEntityDto;

    const existsGuardChief = await User.findOne({
      where: { id: guardChief, role: "head_guard" },
    }).catch(() => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!existsGuardChief) throw ERROR_CODES.USER_NOT_GUARD_CHIEF;

    const existsDelegation = await Delegation.findOne({
      where: { id: delegationId },
    }).catch(() => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

    const exists = await this.existsGuard(date!, delegationId!);
    if (exists) throw ERROR_CODES.GUARD_ALREADY_EXISTS;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const guard = await Guard.create(
        {
          date: new Date(date!),
          guard_chief: guardChief!,
          state: "Nueva",
          delegation_id: delegationId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: guard.id,
        entity: LogEntities.guard,
        action: LogActions.guard.create,
        description:
          `Se creó la guardia del ${date}. ` +
          `Jefe de guardia: ${guardChief}. ` +
          `Delegación: ${delegationId}. ` +
          `Estado inicial: Nueva.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      const formatGuard = {
        id: guard.id,
        guardChief: {
          id: guard.guard_chief,
        },
        date: guard.date,
        delegation: {
          id: guard.delegation_id,
        },
      };

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: formatGuard,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      if (error instanceof UniqueConstraintError) {
        throw ERROR_CODES.GUARD_ALREADY_EXISTS;
      }

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async editGuard(
    guardEntityDto: GuardsEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, guardChief, date, delegationId, state } = guardEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const guard = await Guard.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!guard) throw ERROR_CODES.GUARD_NOT_FOUND;

      const existsGuardChief = await User.findOne({
        where: { id: guardChief, role: "head_guard" },
        transaction: tx,
      });

      if (!existsGuardChief) {
        throw ERROR_CODES.USER_NOT_GUARD_CHIEF;
      }

      const existsDelegation = await Delegation.findOne({
        where: { id: delegationId },
        transaction: tx,
      });

      if (!existsDelegation) {
        throw ERROR_CODES.DELEGATION_NOT_FOUND;
      }

      const previousDate = guard.date.toISOString().slice(0, 10);
      const newDate = new Date(date!).toISOString().slice(0, 10);

      const changes: string[] = [];

      if (guard.guard_chief !== guardChief) {
        changes.push(`jefe de guardia: ${guard.guard_chief} -> ${guardChief}`);
      }

      if (guard.delegation_id !== delegationId) {
        changes.push(`delegación: ${guard.delegation_id} -> ${delegationId}`);
      }

      if (previousDate !== newDate) {
        changes.push(`fecha: ${previousDate} -> ${newDate}`);
      }

      if (String(guard.state) !== state) {
        changes.push(`estado: ${guard.state} -> ${state}`);
      }

      if (changes.length === 0) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      await guard.update(
        {
          guard_chief: guardChief!,
          delegation_id: delegationId!,
          date: new Date(date!),
          state: state!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: guard.id,
        entity: LogEntities.guard,
        action: LogActions.guard.update,
        description:
          `Se editó la guardia ${guard.id}. ` +
          `Cambios: ${changes.join("; ")}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      if (error instanceof UniqueConstraintError) {
        throw ERROR_CODES.GUARD_ALREADY_EXISTS;
      }

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteGuard(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const guard = await Guard.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!guard) throw ERROR_CODES.GUARD_NOT_FOUND;

      if (String(guard.state) !== "Nueva") {
        throw ERROR_CODES.STATE_NOT_ALLOWED;
      }

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: guard.id,
        entity: LogEntities.guard,
        action: LogActions.guard.delete,
        description:
          `Se eliminó la guardia ${guard.id}. ` +
          `Fecha: ${guard.date.toISOString().slice(0, 10)}. ` +
          `Jefe de guardia: ${guard.guard_chief}. ` +
          `Delegación: ${guard.delegation_id}. ` +
          `Estado: ${guard.state}.`,
      });

      if (logError) throw logError;

      await guard.destroy({ transaction: tx });

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

  async getGuards(paginationDto: PaginationDto): Promise<object> {
    const { limit, offset } = paginationDto;

    try {
      const { count, rows: guards } = await Guard.findAndCountAll({
        distinct: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],
        attributes: ["id", "date", "state", "created_at", "updated_at"],
        include: [
          {
            model: User,
            as: "guardChief",
            attributes: ["id", "name", "lastname", "email"],
          },
          {
            model: Delegation,
            as: "delegation",
            attributes: ["id", "name"],
          },
          {
            model: Shift,
            as: "shifts",
            attributes: ["id", "name", "created_at", "updated_at"],
            include: [
              {
                model: Ambulance,
                as: "ambulance",
                attributes: ["id", "number"],
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
              {
                model: ChecklistAmbulance,
                as: "checklistAmbulance",
              },
              {
                model: ChecklistSupply,
                as: "checklistSupplies",
              },
            ],
          },
        ],

        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
      });

      return {
        success: true,
        data: guards,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async getOneGuard(id: string): Promise<object> {
    const guard = await Guard.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "guardChief",
          attributes: ["id", "name", "lastname", "email"],
        },
        { model: Delegation, as: "delegation", attributes: ["id", "name"] },
      ],
    }).catch(() => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!guard) throw ERROR_CODES.GUARD_NOT_FOUND;

    const formatGuard = {
      id: guard.id,
      date: guard.date,
      state: guard.state,
      guardChief: {
        id: guard.guardChief?.id,
        name: guard.guardChief?.name,
        lastname: guard.guardChief?.lastname,
        email: guard.guardChief?.email,
      },
      delegation: {
        id: guard.delegation?.id,
        name: guard.delegation?.name,
      },
    };

    return {
      success: true,
      data: formatGuard,
    };
  }
}
