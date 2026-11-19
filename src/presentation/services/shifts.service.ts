import { AccessContext } from "../../domain/interfaces/access-context.interface";
import { DelegationScope } from "../../infrastructure/helpers/delegation-scope";
import { Transaction } from "sequelize";
import { LogEntityDto, PaginationDto, ShiftEntityDto } from "../../application";
import {
  ERROR_CODES,
  LogActions,
  LogEntities,
  ShiftEntity,
  ShiftsServiceInterface,
} from "../../domain";
import { Ambulance, Guard, sequelize, Shift, User } from "../../infrastructure";
import { LogsService } from "./logs.service";

export class ShiftsService implements ShiftsServiceInterface {
  private readonly logsService = new LogsService();

  private validateData = async (
    actor: AccessContext,
    ambulanceId: string,
    guardId: string,
    paramedicalId: string,
    driverId: string,
    tx: Transaction,
  ): Promise<true | ERROR_CODES> => {
    const scope = new DelegationScope(actor);
    const [amb, grd, prm, drv] = await Promise.all([
      Ambulance.findOne({
        attributes: ["id"],
        transaction: tx,
       where: scope.where("Ambulance", { id: ambulanceId }) }),

      Guard.findOne({
        attributes: ["id"],
        transaction: tx,
       where: scope.where("Guard", { id: guardId }) }),

      User.findOne({
        attributes: ["id"],
        transaction: tx,
       where: scope.where("User", { id: paramedicalId }) }),

      User.findOne({
        attributes: ["id"],
        transaction: tx,
       where: scope.where("User", { id: driverId }) }),
    ]);

    if (!amb) return ERROR_CODES.AMBULANCE_NOT_FOUND;
    if (!grd) return ERROR_CODES.GUARD_NOT_FOUND;
    if (!prm) return ERROR_CODES.PARAMEDICAL_NOT_FOUND;
    if (!drv) return ERROR_CODES.DRIVER_NOT_FOUND;

    return true;
  };

  async createShift(
    actor: AccessContext,
    shiftEntityDto: ShiftEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { ambulanceId, guardId, paramedicalId, driverId } = shiftEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      await scope.assertShiftLinks(ambulanceId!, guardId!, paramedicalId!, driverId!, tx);

      const ok = await this.validateData(actor,
        ambulanceId!,
        guardId!,
        paramedicalId!,
        driverId!,
        tx,
      );

      if (ok !== true) throw ok;

      const ambulance = await Ambulance.findOne({
        attributes: ["number"],
        transaction: tx,
       where: scope.where("Ambulance", { id: ambulanceId! }) });

      if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const entity = ShiftEntity.create({
        ambulanceId,
        guardId,
        paramedicalId,
        driverId,
      });

      const shift = await Shift.create(
        {
          name: `Turno ${ambulance.number}`,
          ambulance_id: entity.ambulanceId!,
          guard_id: entity.guardId!,
          paramedical_id: entity.paramedicalId!,
          driver_id: entity.driverId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: shift.id,
        entity: LogEntities.shift,
        action: LogActions.shift.create,
        description:
          `Se creó el turno ${shift.name}. ` +
          `Ambulancia: ${shift.ambulance_id}. ` +
          `Guardia: ${shift.guard_id}. ` +
          `Paramédico: ${shift.paramedical_id}. ` +
          `Conductor: ${shift.driver_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Guard", shift.guard_id, tx));

      const formatShift = {
        id: shift.id,
        name: shift.name,
        ambulance: {
          id: shift.ambulance_id,
        },
        guard: {
          id: shift.guard_id,
        },
        paramedical: {
          id: shift.paramedical_id,
        },
        driver: {
          id: shift.driver_id,
        },
        createdAt: shift.get("createdAt") as Date,
        updatedAt: shift.get("updatedAt") as Date,
      };

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: formatShift,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async editShift(
    actor: AccessContext,
    shiftEntityDto: ShiftEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { id, name, ambulanceId, guardId, paramedicalId, driverId } =
      shiftEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      await scope.assertShiftLinks(ambulanceId!, guardId!, paramedicalId!, driverId!, tx);
      await scope.assertShiftChecklist(id!, ambulanceId!, tx);

      const shift = await Shift.findOne({
        transaction: tx,
        lock: tx.LOCK.UPDATE,
       where: scope.where("Shift", { id: id! }) });

      if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const ok = await this.validateData(actor,
        ambulanceId!,
        guardId!,
        paramedicalId!,
        driverId!,
        tx,
      );

      if (ok !== true) throw ok;

      const changes: string[] = [];

      if (shift.name !== name) {
        changes.push(`nombre: ${shift.name} -> ${name}`);
      }

      if (shift.ambulance_id !== ambulanceId) {
        changes.push(`ambulancia: ${shift.ambulance_id} -> ${ambulanceId}`);
      }

      if (shift.guard_id !== guardId) {
        changes.push(`guardia: ${shift.guard_id} -> ${guardId}`);
      }

      if (shift.paramedical_id !== paramedicalId) {
        changes.push(`paramédico: ${shift.paramedical_id} -> ${paramedicalId}`);
      }

      if (shift.driver_id !== driverId) {
        changes.push(`conductor: ${shift.driver_id} -> ${driverId}`);
      }

      if (changes.length === 0) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      const previousName = shift.name;

      const entity = ShiftEntity.create({
        name,
        ambulanceId,
        guardId,
        paramedicalId,
        driverId,
      });

      await shift.update(
        {
          name: entity.name!,
          ambulance_id: entity.ambulanceId!,
          guard_id: entity.guardId!,
          paramedical_id: entity.paramedicalId!,
          driver_id: entity.driverId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: shift.id,
        entity: LogEntities.shift,
        action: LogActions.shift.update,
        description:
          `Se editó el turno ${previousName}. ` +
          `Cambios: ${changes.join("; ")}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Guard", shift.guard_id, tx));

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteShift(
    actor: AccessContext,
    shiftEntityDto: ShiftEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { id } = shiftEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const shift = await Shift.findOne({
        transaction: tx,
        lock: tx.LOCK.UPDATE,
       where: scope.where("Shift", { id: id! }) });

      if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: shift.id,
        entity: LogEntities.shift,
        action: LogActions.shift.delete,
        description:
          `Se eliminó el turno ${shift.name}. ` +
          `Ambulancia: ${shift.ambulance_id}. ` +
          `Guardia: ${shift.guard_id}. ` +
          `Paramédico: ${shift.paramedical_id}. ` +
          `Conductor: ${shift.driver_id}.`,
      });

      if (logError) throw logError;

      await shift.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Guard", shift.guard_id, tx));

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getShifts(
    actor: AccessContext,
    guardId: string,
    paginationDto: PaginationDto,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { limit, offset } = paginationDto;

    try {
      const { count, rows: shifts } = await Shift.findAndCountAll({
        where: scope.where("Shift", { guard_id: guardId }),

        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],

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
        ],

        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
      });

      const formatShifts = shifts.map((shift) => ({
        id: shift.id,
        name: shift.name,
        ambulance: shift.ambulance,
        guard: shift.guard,
        paramedical: shift.paramedical,
        driver: shift.driver,
        createdAt: shift.get("createdAt") as Date,
        updatedAt: shift.get("updatedAt") as Date,
      }));

      return {
        success: true,
        data: formatShifts,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async getOneShift(actor: AccessContext, id: string): Promise<object> {
    const scope = new DelegationScope(actor);
    const shift = await Shift.findOne({
      where: scope.where("Shift", { id }),
      attributes: ["id", "name", "created_at", "updated_at"],
      include: [
        { model: Ambulance, as: "ambulance", attributes: ["id", "number"] },
        {
          model: User,
          as: "paramedical",
          attributes: ["id", "name", "lastname"],
        },
        { model: User, as: "driver", attributes: ["id", "name", "lastname"] },
        {
          model: Guard,
          as: "guard",
          attributes: [
            "id",
            "date",
            "state",
            "delegation_id",
            "created_at",
            "updated_at",
          ],
          include: [
            {
              model: User,
              as: "guardChief",
              attributes: ["id", "name", "lastname"],
            },
          ],
        },
      ],
    }).catch(() => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!shift) throw ERROR_CODES.SHIFT_NOT_FOUND;

    return {
      success: true,
      data: shift,
    };
  }
}
