import { AdmServiceInterface } from "../../domain/services/adm.service.interface";
import { Delegation, sequelize, User } from "../../infrastructure";
import { LogEntityDto, UserEntityDto } from "../../application";
import { ERROR_CODES, LogActions, LogEntities, UserEntity } from "../../domain";

// librerias externas
import bcrypt from "bcrypt";
import { Transaction } from "sequelize";
import { PaginationDto } from "../../application/dtos/pagination.dto";
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

export class AdmService implements AdmServiceInterface {
  private readonly logsService = new LogsService();

  public async createUser(
    userEntityDto: UserEntityDto,
    userId: string,
  ): Promise<object> {
    const {
      name,
      lastname,
      email,
      password,
      role,
      position,
      delegationId: delegation_id,
    } = userEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({
        where: { email },
        transaction: tx,
      });

      if (exists) throw ERROR_CODES.EMAIL_ALREADY_REGISTERED;

      const existsDelegation = await Delegation.findOne({
        where: { id: delegation_id },
        transaction: tx,
      });

      if (!existsDelegation) throw ERROR_CODES.INVALID_DELEGATION_ID;

      const hashedPassword = await bcrypt.hash(password as string, 10);

      const userEntity = UserEntity.create({
        name,
        lastname,
        email,
        hashedPassword,
        role,
        position,
        delegation_id,
      });

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
        { transaction: tx },
      );

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: user.id,
        entity: LogEntities.user,
        action: LogActions.user.create,
        description:
          `Se creó el usuario ${user.name} ${user.lastname}. ` +
          `ID: ${user.id}. Rol: ${user.role}. ` +
          `Cargo: ${user.position}. ` +
          `Delegación: ${user.delegation_id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      const userSafe = await User.findByPk(user.id, {
        attributes: { exclude: ["password"] },
        transaction: tx,
      });

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: userSafe,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.INSERT_FAILED;
    }
  }

  public async editUser(
    userEntityDto: UserEntityDto,
    userId: string,
  ): Promise<object> {
    const { id, name, lastname, email, role, position, delegationId, status } =
      userEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id!, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      const existsDelegation = await Delegation.findOne({
        where: { id: delegationId },
        transaction: tx,
      });

      if (!existsDelegation) throw ERROR_CODES.INVALID_DELEGATION_ID;

      const changes: string[] = [];

      if (user.name !== name) {
        changes.push(`nombre: ${user.name} -> ${name}`);
      }

      if (user.lastname !== lastname) {
        changes.push(`apellido: ${user.lastname} -> ${lastname}`);
      }

      if (user.email !== email) {
        changes.push(`correo: ${user.email} -> ${email}`);
      }

      if (user.role !== role) {
        changes.push(`rol: ${user.role} -> ${role}`);
      }

      if (user.position !== position) {
        changes.push(`cargo: ${user.position} -> ${position}`);
      }

      if (user.delegation_id !== delegationId) {
        changes.push(`delegación: ${user.delegation_id} -> ${delegationId}`);
      }

      if (user.status !== status) {
        changes.push(`estado: ${user.status} -> ${status}`);
      }

      if (changes.length > 0) {
        await user.update(
          {
            name: name!,
            lastname: lastname!,
            email: email!,
            role: role!,
            position: position!,
            delegation_id: delegationId!,
            status: status!,
          },
          { transaction: tx },
        );

        const [logError, logDto] = LogEntityDto.create({
          userId,
          affected: user.id,
          entity: LogEntities.user,
          action: LogActions.user.update,
          description:
            `Se editó el usuario ${user.id}. ` +
            `Cambios: ${changes.join("; ")}.`,
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      const userSafe = await User.findByPk(user.id, {
        attributes: { exclude: ["password"] },
        transaction: tx,
      });

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: userSafe,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async deleteUser(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      if (user.status === false) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      await user.update({ status: false }, { transaction: tx });

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: user.id,
        entity: LogEntities.user,
        action: LogActions.user.delete,
        description:
          `Se desactivó el usuario ${user.name} ${user.lastname}. ` +
          `ID: ${user.id}. Rol: ${user.role}. ` +
          `Estado: activo -> inactivo.`,
      });

      if (logError) throw logError;

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

  async getAllUsers(paginationDto: PaginationDto): Promise<object> {
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
        ...(role !== undefined ? { where: { role } } : {}),
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

  async changePasswordUser(
    id: string,
    password: string,
    userId: string,
  ): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      const hashedPassword = await bcrypt.hash(password, 10);

      await user.update({ password: hashedPassword }, { transaction: tx });

      const [logError, logDto] = LogEntityDto.create({
        userId,
        affected: user.id,
        entity: LogEntities.user,
        action: LogActions.user.resetPassword,
        description:
          `Un administrador restableció la contraseña ` +
          `del usuario ${user.id}.`,
      });

      if (logError) throw logError;

      await this.logsService.create(logDto!, tx);

      await tx.commit();
      tx = undefined;

      return { success: true };
    } catch (error) {
      if (tx) await tx.rollback();

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
