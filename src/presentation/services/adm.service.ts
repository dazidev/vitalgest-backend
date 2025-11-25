import { AdmServiceInterface } from "../../domain/services/adm.service.interface";
import { Delegation, sequelize, User } from "../../infrastructure";
import { UserEntityDto } from "../../application";
import { ERROR_CODES, UserEntity } from "../../domain";

// librerias externas
import bcrypt from "bcrypt";
import { Transaction } from "sequelize";

const mapUserRow = (r: any): object => ({
  id: r.id,
  name: r.name,
  lastname: r.lastname,
  email: r.email,
  status: r.status,
  role: r.role,
  position: r.position,
  delegation: {
    id: r.delegation_id,
  },
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
});

export class AdmService implements AdmServiceInterface {
  public async createUser(userEntityDto: UserEntityDto): Promise<object> {
    let tx: Transaction | undefined;
    const {
      name,
      lastname,
      email,
      password,
      role,
      position,
      delegationId: delegation_id,
    } = userEntityDto;

    try {
      tx = await sequelize.transaction();
      const exists = await User.findOne({
        where: { email: email },
        transaction: tx,
      });
      if (exists) throw ERROR_CODES.EMAIL_ALREADY_REGISTERED;

      const existsDelegation = await Delegation.findOne({
        where: { id: delegation_id },
      });
      if (!existsDelegation) throw ERROR_CODES.INVALID_DELEGATION_ID;

      const hashedPassword = await bcrypt.hash(password as string, 10);

      const UserHashed = {
        name,
        lastname,
        email,
        hashedPassword,
        role,
        position,
        delegation_id,
      };

      const userEntity = UserEntity.create(UserHashed);

      const user = await User.create(
        {
          name: userEntity.name!,
          lastname: userEntity.lastname!,
          email: userEntity.email!,
          password: userEntity.password!,
          status: true,
          role: userEntity.role!,
          position: userEntity.position!,
          delegation_id: userEntity.delegation_id!,
        },
        { transaction: tx }
      );

      await tx.commit();

      const userSafe = await User.findByPk(user.id, {
        attributes: { exclude: ["password"] },
      });

      return {
        success: true,
        data: userSafe,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  public async editUser(userEntityDto: UserEntityDto): Promise<object> {
    const { id, name, lastname, email, role, position, delegationId, status } =
      userEntityDto;
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      const existsDelegation = await Delegation.findOne({
        where: { id: delegationId },
      });
      if (!existsDelegation) throw ERROR_CODES.INVALID_DELEGATION_ID;

      await User.update(
        {
          name,
          lastname,
          email,
          role,
          position,
          delegation_id: delegationId,
          status: status,
        },
        { where: { id }, transaction: tx }
      );

      await tx.commit();

      const userSafe = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      return {
        success: true,
        data: userSafe,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteUser(id: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      await User.update({ status: false }, { where: { id }, transaction: tx });

      await tx.commit();

      return { success: true };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.DELETE_FAILED;
    }
  }

  async getAllUsers(amount: string, role?: string): Promise<object> {
    let newAmount;
    if (amount !== "all") newAmount = parseInt(amount);
    else newAmount = amount;

    try {
      const options: any = {
        attributes: { exclude: ["password"] },
      };

      if (role) options.where = { role };
      if (newAmount !== "all") options.limit = Number(newAmount);

      const users = await User.findAll(options);

      const data = users.map(mapUserRow);

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async changePasswordUser(id: string, password: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      const hashedPassword = await bcrypt.hash(password as string, 10);

      await User.update(
        { password: hashedPassword },
        { where: { id }, transaction: tx }
      );

      await tx.commit();

      return {
        success: true,
      };
    } catch (error) {
      await tx?.rollback();
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async getUserById(id: string): Promise<object> {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      const data = [user].map(mapUserRow);

      return {
        success: true,
        data: data[0],
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR; // todo: cambiar a error en la busqueda
    }
  }
}
