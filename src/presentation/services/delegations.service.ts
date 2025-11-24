import { DelegationsServiceInterface } from "../../domain";
import { ERROR_CODES } from "../../domain/enums/error-codes.enum";
import { DelegationEntity } from "../../domain/entities/delegation.entity";

import {
  Municipality,
  Pharmacy,
  Delegation,
  sequelize,
  State,
} from "../../infrastructure";
import { Transaction } from "sequelize";

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
  private async getDelegationName(
    municipalityId: number
  ): Promise<string | boolean> {
    const municipality = await Municipality.findOne({
      where: { id: municipalityId },
      attributes: ["name"],
      include: { model: State, as: "state", attributes: ["name"] },
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
      })
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
      }
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

  async createDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { municipalityId } = delegationEntity;

    let tx: Transaction | undefined;

    const name = await this.getDelegationName(municipalityId!);
    if (!name) throw ERROR_CODES.UPDATE_FAILED;

    try {
      tx = await sequelize.transaction();

      const delegation = await Delegation.create(
        {
          name: name as string,
          municipality_id: municipalityId!,
        },
        { transaction: tx }
      );

      await Pharmacy.create(
        {
          delegation_id: delegation.id,
        },
        { transaction: tx }
      );

      await tx.commit();

      const formatDelegation = [delegation].map(mapDelegationRow);

      return {
        success: true,
        data: formatDelegation,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  async editDelegation(delegationEntity: DelegationEntity): Promise<object> {
    const { id, municipalityId } = delegationEntity;

    const exists = await Delegation.findOne({ where: { id } }).catch(
      (_error) => {
        throw ERROR_CODES.UNKNOWN_DB_ERROR;
      }
    );

    if (!exists) throw ERROR_CODES.DELEGATION_NOT_FOUND;

    const existsMunicipality = await Municipality.findOne({
      where: { id: municipalityId },
    }).catch((_error) => {
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    });

    if (!existsMunicipality) throw ERROR_CODES.MUNICIPALITY_NOT_FOUND;

    const name = await this.getDelegationName(municipalityId!);
    if (!name) throw ERROR_CODES.UPDATE_FAILED;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const delegation = await Delegation.update(
        {
          name: name as string,
          municipality_id: municipalityId,
        },
        { where: { id }, transaction: tx }
      );

      await tx.commit();

      if (!delegation) throw ERROR_CODES.UPDATE_FAILED;

      return {
        success: true,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteDelegation(id: string): Promise<object> {
    //! todo: eliminar luego todo lo vinculado con la farmacia y delegación.
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      await Delegation.findByPk(id, {
        include: [{ model: Pharmacy, as: "pharmacy", attributes: ["id"] }],
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      const count = await Delegation.destroy({
        where: { id },
        transaction: tx,
      });

      await Pharmacy.destroy({ where: { id }, transaction: tx });

      if (count === 0) throw ERROR_CODES.DELEGATION_NOT_FOUND;

      await tx.commit();

      return { success: true };
    } catch (error) {
      console.log(error);
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getDelegations(amount: string): Promise<object> {
    let newAmount;
    if (amount !== "all") newAmount = parseInt(amount);
    else newAmount = amount;

    const options: any = {
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
    };

    if (newAmount !== "all") options.limit = Number(newAmount);

    const delegations = await Delegation.findAll(options);

    if (delegations.length === 0) throw ERROR_CODES.DELEGATION_NOT_FOUND;

    const formatDelegations = delegations.map(mapDelegationRow);

    return {
      success: true,
      data: formatDelegations,
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
}
