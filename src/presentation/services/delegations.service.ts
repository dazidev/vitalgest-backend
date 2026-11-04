import {
  DelegationsServiceInterface,
  LogActions,
  LogEntities,
} from "../../domain";
import { ERROR_CODES } from "../../domain/enums/error-codes.enum";
import { DelegationEntity } from "../../domain/entities/delegation.entity";

import {
  Municipality,
  Pharmacy,
  Delegation,
  sequelize,
  State,
  User,
} from "../../infrastructure";
import { Transaction } from "sequelize";
import { LogEntityDto, PaginationDto } from "../../application";
import { LogsService } from "./logs.service";

const mapUserRow = (r: any): object => ({
  id: r.id,
  name: r.name,
  lastname: r.lastname,
  email: r.email,
  status: r.status,
  role: r.role,
  signature: r.signature,
  photo: r.photo,
  phone: r.phone,
  position: r.position,
  delegation: {
    id: r.delegation_id,
  },
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

const mapDelegationRow = (r: any): object => ({
  id: r.id,
  name: r.name,
  municipality: {
    id: r.municipality?.id,
    name: r.municipality?.name,
  },
  state: r.municipality?.state,
  pharmacy: r.pharmacy,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

export class DelegationsService implements DelegationsServiceInterface {
  private readonly logsService = new LogsService();

  private async getDelegationName(
    municipalityId: number,
    transaction?: Transaction,
  ): Promise<string | false> {
    const municipality = await Municipality.findOne({
      where: { id: municipalityId },
      attributes: ["name"],
      include: {
        model: State,
        as: "state",
        attributes: ["name"],
      },
      ...(transaction ? { transaction } : {}),
    });

    if (!municipality) return false;

    const name = `Delegación ${municipality.name}, ${municipality.state?.name}`;

    return name;
  }

  async getStates(): Promise<object> {
    const states = await State.findAll().catch((_error) => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (states.length === 0) throw ERROR_CODES.STATES_NOT_FOUND;

    const results = await Promise.all(
      states.map(async (state) => {
        const municipalities = await Municipality.findAll({
          where: { state_id: state.id },
          attributes: ["id", "name"],
          order: [["name", "ASC"]],
        });

        return {
          id: state.id,
          name: state.name,
          municipalities: municipalities, // opcional
        };
      }),
    );

    return {
      success: true,
      data: results ? results : states,
    };
  }

  async getMunicipalities(state: number): Promise<object> {
    const exists = await State.findOne({ where: { id: state } }).catch(
      (_error) => {
        throw ERROR_CODES.UNKNOWN_DB_ERROR;
      },
    );

    if (!exists) throw ERROR_CODES.STATE_NOT_FOUND;

    const municipalities = await Municipality.findAll({
      where: { state_id: state },
    }).catch((_error) => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (municipalities.length === 0) throw ERROR_CODES.MUNICIPALITIES_NOT_FOUND;

    const formatMunicipalities = municipalities.map((m) => ({
      id: m.id,
      name: m.name,
      state: {
        id: m.state_id,
      },
    }));

    return formatMunicipalities;
  }

  async createDelegation(
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object> {
    const { municipalityId } = delegationEntity;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const name = await this.getDelegationName(Number(municipalityId), tx);

      if (!name) throw ERROR_CODES.MUNICIPALITY_NOT_FOUND;

      const delegation = await Delegation.create(
        {
          name,
          municipality_id: Number(municipalityId),
        },
        { transaction: tx },
      );

      const pharmacy = await Pharmacy.create(
        {
          delegation_id: delegation.id,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: delegation.id,
        entity: LogEntities.delegation,
        action: LogActions.delegation.create,
        description:
          `Se creó la delegación ${delegation.name}. ` +
          `Municipio: ${delegation.municipality_id}. ` +
          `Farmacia creada: ${pharmacy.id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      const formatDelegation = [delegation].map(mapDelegationRow);

      return {
        success: true,
        data: formatDelegation,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async editDelegation(
    delegationEntity: DelegationEntity,
    userId: string,
  ): Promise<object> {
    const { id, municipalityId } = delegationEntity;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const delegation = await Delegation.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!delegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

      const newMunicipalityId = Number(municipalityId);

      const name = await this.getDelegationName(newMunicipalityId, tx);

      if (!name) throw ERROR_CODES.MUNICIPALITY_NOT_FOUND;

      const changes: string[] = [];

      if (delegation.name !== name) {
        changes.push(`nombre: ${delegation.name} -> ${name}`);
      }

      if (Number(delegation.municipality_id) !== newMunicipalityId) {
        changes.push(
          `municipio: ${delegation.municipality_id} -> ${newMunicipalityId}`,
        );
      }

      if (changes.length === 0) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      const previousName = delegation.name;

      await delegation.update(
        {
          name,
          municipality_id: newMunicipalityId,
        },
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: delegation.id,
        entity: LogEntities.delegation,
        action: LogActions.delegation.update,
        description:
          `Se editó la delegación ${previousName}. ` +
          `Cambios: ${changes.join("; ")}.`,
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

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteDelegation(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const delegation = await Delegation.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!delegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

      const pharmacy = await Pharmacy.findOne({
        where: { delegation_id: id },
        attributes: ["id"],
        transaction: tx,
      });

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: delegation.id,
        entity: LogEntities.delegation,
        action: LogActions.delegation.delete,
        description:
          `Se eliminó la delegación ${delegation.name}. ` +
          `Municipio: ${delegation.municipality_id}. ` +
          `Farmacia asociada: ${pharmacy?.id ?? "Sin farmacia"}.`,
      });

      if (logError) throw logError;

      await delegation.destroy({ transaction: tx });

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

  async getDelegations(paginationDto: PaginationDto): Promise<object> {
    const { limit, offset } = paginationDto;

    const { count, rows: delegations } = await Delegation.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["id", "ASC"],
      ],
      include: [
        {
          model: Municipality,
          as: "municipality",
          attributes: ["id", "name"],
          include: [{ model: State, as: "state", attributes: ["id", "name"] }],
        },
        { model: Pharmacy, as: "pharmacy", attributes: ["id"] },
      ],
      attributes: {
        exclude: ["municipality_id"],
      },
      ...(limit !== undefined ? { limit } : {}),
      ...(offset !== undefined ? { offset } : {}),
    });

    const formatDelegations = delegations.map(mapDelegationRow);

    return {
      success: true,
      data: formatDelegations,
      total: count,
    };
  }

  async getDelegation(id: string): Promise<object> {
    const delegation = await Delegation.findByPk(id, {
      include: [
        {
          model: Municipality,
          as: "municipality",
          attributes: ["id", "name"],
          include: [{ model: State, as: "state", attributes: ["id", "name"] }],
        },
        { model: Pharmacy, as: "pharmacy", attributes: ["id"] },
      ],
      attributes: {
        exclude: ["municipality_id", "pharmacy_id"],
      },
    }).catch((_error) => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!delegation) throw ERROR_CODES.DELEGATION_NOT_FOUND;

    const formatDelegations = [delegation].map(mapDelegationRow);

    return {
      success: true,
      data: formatDelegations[0],
    };
  }

  async getMembers(id: string, paginationDto: PaginationDto): Promise<object> {
    const { limit, offset, role } = paginationDto;

    try {
      const { count, rows: users } = await User.findAndCountAll({
        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],
        attributes: { exclude: ["password"] },

        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
        where: {
          delegation_id: id,
          ...(role !== undefined ? { role } : {}),
        },
      });

      const data = users.map(mapUserRow);

      return {
        success: true,
        data,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }
}
