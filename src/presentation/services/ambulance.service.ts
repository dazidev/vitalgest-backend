import { Transaction } from "sequelize";
import {
  AmbulanceEntityDto,
  SupplyAmbEntityDto,
  LogEntityDto,
  PaginationDto,
} from "../../application";
import {
  AmbulanceEntity,
  AmbulancesServiceInterface,
  ERROR_CODES,
  LogActions,
  LogEntities,
} from "../../domain";
import {
  Ambulance,
  AreaAmbulance,
  Delegation,
  sequelize,
  Supply,
  SupplyAmbulance,
} from "../../infrastructure";
import { UniqueConstraintError } from "sequelize";
import { LogsService } from "./logs.service";

export class AmbulancesService implements AmbulancesServiceInterface {
  private readonly logsService = new LogsService();

  async getAreas(): Promise<object> {
    const areas = await AreaAmbulance.findAll();
    if (!areas) throw ERROR_CODES.AREAS_NOT_FOUND;

    return {
      success: true,
      data: areas,
    };
  }

  async createAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object> {
    const { delegationId, number } = ambulanceEntityDto;

    const ambulanceEntity = AmbulanceEntity.create(ambulanceEntityDto);
    if (!ambulanceEntity) throw ERROR_CODES.INSERT_FAILED;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const existsDelegation = await Delegation.findOne({
        where: { id: delegationId },
        transaction: tx,
      });

      if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

      const exists = await Ambulance.findOne({
        where: { number },
        transaction: tx,
      });

      if (exists) throw "AMBULANCE_EXISTS";

      const ambulance = await Ambulance.create(
        {
          number: ambulanceEntity.number!,
          brand: ambulanceEntity.brand!,
          model: ambulanceEntity.model!,
          delegation_id: ambulanceEntity.delegationId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: ambulance.id,
        entity: LogEntities.ambulance,
        action: LogActions.ambulance.create,
        description: `Se creó la ambulancia ${ambulance.number}. Marca: ${ambulance.brand}, modelo: ${ambulance.model}, delegación: ${ambulance.delegation_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      const formatAmbulance = {
        id: ambulance.id,
        number: ambulance.number,
        brand: ambulance.brand,
        model: ambulance.model,
        delegation: {
          id: ambulance.delegation_id,
        },
      };

      await tx.commit();

      return {
        success: true,
        data: formatAmbulance,
      };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      if (error instanceof UniqueConstraintError) {
        throw "AMBULANCE_EXISTS";
      }

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async editAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, delegationId } = ambulanceEntityDto;

    const ambulanceEntity = AmbulanceEntity.edit(ambulanceEntityDto);
    if (!ambulanceEntity) throw ERROR_CODES.UPDATE_FAILED;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const ambulance = await Ambulance.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const existsDelegation = await Delegation.findOne({
        where: { id: delegationId },
        transaction: tx,
      });

      if (!existsDelegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

      const changes: string[] = [];

      if (ambulance.number !== ambulanceEntity.number) {
        changes.push(
          `número: ${ambulance.number} -> ${ambulanceEntity.number}`,
        );
      }

      if (ambulance.brand !== ambulanceEntity.brand) {
        changes.push(`marca: ${ambulance.brand} -> ${ambulanceEntity.brand}`);
      }

      if (ambulance.model !== ambulanceEntity.model) {
        changes.push(`modelo: ${ambulance.model} -> ${ambulanceEntity.model}`);
      }

      if (ambulance.delegation_id !== ambulanceEntity.delegationId) {
        changes.push(
          `delegación: ${ambulance.delegation_id} -> ${ambulanceEntity.delegationId}`,
        );
      }

      if (changes.length === 0) {
        await tx.commit();
        return { success: true };
      }

      const previousNumber = ambulance.number;

      await ambulance.update(
        {
          number: ambulanceEntity.number!,
          brand: ambulanceEntity.brand!,
          model: ambulanceEntity.model!,
          delegation_id: ambulanceEntity.delegationId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: ambulance.id,
        entity: LogEntities.ambulance,
        action: LogActions.ambulance.update,
        description: `Se editó la ambulancia ${previousNumber}. Cambios: ${changes.join("; ")}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteAmbulance(
    ambulanceEntityDto: AmbulanceEntityDto,
    userId: string,
  ): Promise<object> {
    const { id } = ambulanceEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const ambulance = await Ambulance.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: ambulance.id,
        entity: LogEntities.ambulance,
        action: LogActions.ambulance.delete,
        description: `Se eliminó la ambulancia ${ambulance.number}. Marca: ${ambulance.brand}, modelo: ${ambulance.model}, delegación: ${ambulance.delegation_id}.`,
      });

      if (logError) throw logError;

      await ambulance.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx);

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getAmbulances(paginationDto: PaginationDto): Promise<object> {
    const { limit, offset } = paginationDto;

    const { count, rows: ambulances } = await Ambulance.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["id", "ASC"],
      ],
      include: [
        {
          model: Delegation,
          as: "delegation",
          attributes: ["id", "name"],
        },
      ],
      ...(limit !== undefined ? { limit } : {}),
      ...(offset !== undefined ? { offset } : {}),
    });

    const formatAmbulances = ambulances.map((ambulance) => ({
      id: ambulance.id,
      number: ambulance.number,
      brand: ambulance.brand,
      model: ambulance.model,
      delegation: {
        id: ambulance.delegation?.id,
        name: ambulance.delegation?.name,
      },
    }));

    return {
      success: true,
      data: formatAmbulances,
      total: count,
    };
  }

  async getOneAmbulance(id: string): Promise<object> {
    const ambulance = await Ambulance.findOne({
      where: { id },
      include: [
        { model: Delegation, as: "delegation", attributes: ["id", "name"] },
      ],
    }).catch(() => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!ambulance) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

    const formatAmbulance = {
      id: ambulance.id,
      number: ambulance.number,
      brand: ambulance.brand,
      model: ambulance.model,
      delegation: {
        id: ambulance.delegation?.id,
        name: ambulance.delegation?.name,
      },
    };

    return {
      success: true,
      data: formatAmbulance,
    };
  }

  async addSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object> {
    const { avaibleQuantity, minQuantity, areaId, ambulanceId, supplyId } =
      supplyAmbEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const supplyInfo = await Supply.findOne({
        where: { id: supplyId },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!supplyInfo) throw ERROR_CODES.SUPPLY_NOT_FOUND;

      const quantity = Number(avaibleQuantity!);

      if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        throw ERROR_CODES.INVALID_QUANTITY;
      }

      const previousQuantity = supplyInfo.avaible_quantity;

      if (quantity > previousQuantity) {
        throw ERROR_CODES.QUANTITY_NOT_EXIST;
      }

      const newQuantity = previousQuantity - quantity;

      await supplyInfo.update(
        {
          avaible_quantity: newQuantity,
        },
        { transaction: tx },
      );

      const supplyAmb = await SupplyAmbulance.create(
        {
          category: supplyInfo.category,
          specification: supplyInfo.specification,
          avaible_quantity: quantity,
          min_quantity: Number(minQuantity!),
          expiration_date: supplyInfo.expiration_date,
          measurement_unit: supplyInfo.measurement_unit,
          area_id: Number(areaId),
          ambulance_id: ambulanceId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supplyAmb.id,
        entity: LogEntities.ambulanceSupply,
        action: LogActions.ambulance.supply.add,
        description:
          `Se agregó el suministro ${supplyInfo.category}` +
          ` (${supplyInfo.specification ?? "Sin especificación"})` +
          ` a la ambulancia ${ambulanceId}. ` +
          `Cantidad agregada: ${quantity} ${supplyInfo.measurement_unit}. ` +
          `Cantidad mínima: ${minQuantity}. Área: ${areaId}. ` +
          `Suministro de farmacia: ${supplyId}. ` +
          `Existencias en farmacia: ${previousQuantity} -> ${newQuantity}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();

      return {
        success: true,
        data: supplyAmb,
      };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async editSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, avaibleQuantity, minQuantity, areaId, ambulanceId } =
      supplyAmbEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const supply = await SupplyAmbulance.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

      const newQuantity = Number(avaibleQuantity!);
      const newMinQuantity = Number(minQuantity!);
      const newAreaId = Number(areaId!);

      const changes: string[] = [];

      if (supply.avaible_quantity !== newQuantity) {
        changes.push(`cantidad: ${supply.avaible_quantity} -> ${newQuantity}`);
      }

      if (supply.min_quantity !== newMinQuantity) {
        changes.push(
          `cantidad mínima: ${supply.min_quantity} -> ${newMinQuantity}`,
        );
      }

      if (Number(supply.area_id) !== newAreaId) {
        changes.push(`área: ${supply.area_id} -> ${newAreaId}`);
      }

      if (supply.ambulance_id !== ambulanceId) {
        changes.push(`ambulancia: ${supply.ambulance_id} -> ${ambulanceId}`);
      }

      if (changes.length === 0) {
        await tx.commit();
        return { success: true };
      }

      const supplyName = supply.category;
      const specification = supply.specification;

      await supply.update(
        {
          avaible_quantity: newQuantity,
          min_quantity: newMinQuantity,
          area_id: newAreaId,
          ambulance_id: ambulanceId!,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supply.id,
        entity: LogEntities.ambulanceSupply,
        action: LogActions.ambulance.supply.update,
        description:
          `Se editó el suministro ${supplyName}` +
          ` (${specification ?? "Sin especificación"}). ` +
          `Cambios: ${changes.join("; ")}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async deleteSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
    userId: string,
  ): Promise<object> {
    const { id } = supplyAmbEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const supply = await SupplyAmbulance.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!supply) throw ERROR_CODES.SUPPLY_NOT_FOUND;

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: supply.id,
        entity: LogEntities.ambulanceSupply,
        action: LogActions.ambulance.supply.remove,
        description:
          `Se eliminó el suministro ${supply.category}` +
          ` (${supply.specification ?? "Sin especificación"})` +
          ` de la ambulancia ${supply.ambulance_id}. ` +
          `Cantidad registrada: ${supply.avaible_quantity} ` +
          `${supply.measurement_unit}. ` +
          `Cantidad mínima: ${supply.min_quantity}. ` +
          `Área: ${supply.area_id}.`,
      });

      if (logError) throw logError;

      await supply.destroy({ transaction: tx });

      await this.logsService.create(logDto!, tx);

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async getAmbSupplies(ambulanceId: string): Promise<object> {
    try {
      const pharmacy = Ambulance.findOne({ where: { id: ambulanceId } });
      if (!pharmacy) throw ERROR_CODES.AMBULANCE_NOT_FOUND;

      const supplies = await SupplyAmbulance.findAll({
        where: { ambulance_id: ambulanceId },
      });
      if (supplies.length === 0) throw ERROR_CODES.SUPPLIES_NOT_FOUND;

      return {
        success: true,
        data: supplies,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async getOneAmbSupply(
    supplyAmbEntityDto: SupplyAmbEntityDto,
  ): Promise<object> {
    const { id } = supplyAmbEntityDto;
    try {
      const supply = await SupplyAmbulance.findOne({ where: { id } });
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
