import { AccessContext } from "../../domain/interfaces/access-context.interface";
import { DelegationScope } from "../../infrastructure/helpers/delegation-scope";
import { Transaction } from "sequelize";
import {
  LogEntityDto,
  PaginationDto,
  SupplyEntityDto,
} from "../../application";
import {
  ERROR_CODES,
  LogActions,
  LogEntities,
  SuppliesServiceInterface,
} from "../../domain";
import { Pharmacy, sequelize, Supply } from "../../infrastructure";
import { LogsService } from "./logs.service";

export class SuppliesService implements SuppliesServiceInterface {
  private readonly logsService = new LogsService();

  async createSupply(
    actor: AccessContext,
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const {
      category,
      specification,
      avaibleQuantity,
      expirationDate,
      measurementUnit,
      pharmacyId,
    } = supplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const pharmacy = await Pharmacy.findOne({
        where: scope.where("Pharmacy", { id: pharmacyId }),
        transaction: tx,
      });

      if (!pharmacy) throw ERROR_CODES.PHARMACY_NOT_FOUND;

      const supply = await Supply.create(
        {
          category: category!,
          specification: specification!,
          avaible_quantity: Number(avaibleQuantity!),
          expiration_date: new Date(expirationDate!),
          measurement_unit: measurementUnit!,
          pharmacy_id: pharmacyId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supply.id,
        entity: LogEntities.supply,
        action: LogActions.supply.create,
        description:
          `Se creó el suministro ${supply.category}` +
          ` (${supply.specification ?? "Sin especificación"}). ` +
          `Cantidad inicial: ${supply.avaible_quantity} ` +
          `${supply.measurement_unit}. ` +
          `Caducidad: ${supply.expiration_date.toISOString()}. ` +
          `Farmacia: ${supply.pharmacy_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Pharmacy", supply.pharmacy_id, tx));

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: supply,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async editSupply(
    actor: AccessContext,
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const {
      id,
      category,
      specification,
      avaibleQuantity,
      expirationDate,
      measurementUnit,
      pharmacyId,
    } = supplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      DelegationScope.same(await scope.delegationOf("Supply", id!, tx), await scope.delegationOf("Pharmacy", pharmacyId!, tx));

      const supply = await Supply.findOne({
        where: scope.where("Supply", { id }),
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

      const newQuantity = Number(avaibleQuantity!);
      const newExpirationDate = new Date(expirationDate!);

      const newSpecification =
        specification === undefined ? supply.specification : specification;

      const changes: string[] = [];

      if (supply.category !== category) {
        changes.push(`categoría: ${supply.category} -> ${category}`);
      }

      if ((supply.specification ?? null) !== (newSpecification ?? null)) {
        changes.push(
          `especificación: ${supply.specification ?? "Sin especificación"} -> ` +
            `${newSpecification ?? "Sin especificación"}`,
        );
      }

      if (supply.avaible_quantity !== newQuantity) {
        changes.push(
          `cantidad disponible: ${supply.avaible_quantity} -> ${newQuantity}`,
        );
      }

      if (
        new Date(supply.expiration_date).getTime() !==
        newExpirationDate.getTime()
      ) {
        changes.push(
          `caducidad: ${new Date(supply.expiration_date).toISOString()} -> ` +
            `${newExpirationDate.toISOString()}`,
        );
      }

      if (supply.measurement_unit !== measurementUnit) {
        changes.push(
          `unidad de medida: ${supply.measurement_unit} -> ${measurementUnit}`,
        );
      }

      if (supply.pharmacy_id !== pharmacyId) {
        changes.push(`farmacia: ${supply.pharmacy_id} -> ${pharmacyId}`);
      }

      if (changes.length === 0) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      const previousCategory = supply.category;

      await supply.update(
        {
          category: category!,
          specification: newSpecification,
          avaible_quantity: newQuantity,
          expiration_date: newExpirationDate,
          measurement_unit: measurementUnit!,
          pharmacy_id: pharmacyId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supply.id,
        entity: LogEntities.supply,
        action: LogActions.supply.update,
        description:
          `Se editó el suministro ${previousCategory}. ` +
          `Cambios: ${changes.join("; ")}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Pharmacy", supply.pharmacy_id, tx));

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async deleteSupply(
    actor: AccessContext,
    supplyEntityDto: SupplyEntityDto,
    userId: string,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { id } = supplyEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const supply = await Supply.findOne({
        where: scope.where("Supply", { id }),
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supply.id,
        entity: LogEntities.supply,
        action: LogActions.supply.delete,
        description:
          `Se eliminó el suministro ${supply.category}` +
          ` (${supply.specification ?? "Sin especificación"}). ` +
          `Cantidad disponible: ${supply.avaible_quantity} ` +
          `${supply.measurement_unit}. ` +
          `Caducidad: ${new Date(supply.expiration_date).toISOString()}. ` +
          `Farmacia: ${supply.pharmacy_id}.`,
      });

      if (logError) throw logError;

      await supply.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx, await scope.delegationOf("Pharmacy", supply.pharmacy_id, tx));

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  //! falta hacer uno por todos
  async getSupplies(
    actor: AccessContext,
    pharmacyId: string,
    paginationDto: PaginationDto,
  ): Promise<object> {
    const scope = new DelegationScope(actor);
    const { limit, offset } = paginationDto;

    try {
      const pharmacy = await Pharmacy.findOne({
        where: scope.where("Pharmacy", { id: pharmacyId }),
      });

      if (!pharmacy) throw ERROR_CODES.PHARMACY_NOT_FOUND;

      const { count, rows: supplies } = await Supply.findAndCountAll({
        where: scope.where("Supply", { pharmacy_id: pharmacyId }),
        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],
        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
      });

      return {
        success: true,
        data: supplies,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async getOneSupply(actor: AccessContext, id: string): Promise<object> {
    const scope = new DelegationScope(actor);
    try {
      const supply = await Supply.findOne({ where: scope.where("Supply", { id }) });
      if (!supply) throw ERROR_CODES.SUPPLIES_NOT_FOUND;

      return {
        success: true,
        data: supply,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }
}
