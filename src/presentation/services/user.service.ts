import { sequelize, User } from "../../infrastructure";
import { ERROR_CODES, LogActions, LogEntities } from "../../domain";

// librerias externas
import bcrypt from "bcrypt";
import { Transaction } from "sequelize";
import { config } from "dotenv";
import { LogsService } from "./logs.service";
import { LogEntityDto } from "../../application";

config();

export class UserService {
  private readonly logsService = new LogsService();

  async changePassword(
    id: string,
    currentPass: string,
    newPass: string,
  ): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      const isMatching = await bcrypt.compare(currentPass, user.password);

      if (!isMatching) throw ERROR_CODES.CREDENTIALS_NOT_MATCH;

      const hashedPassword = await bcrypt.hash(newPass, 10);

      await user.update({ password: hashedPassword }, { transaction: tx });

      const [logError, logDto] = LogEntityDto.create({
        userId: id,
        affected: user.id,
        entity: LogEntities.user,
        action: LogActions.user.changePassword,
        description: `El usuario ${user.id} cambió su contraseña personal.`,
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

  async changeInfo(
    id: string,
    name: string,
    lastname: string,
  ): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      const changes: string[] = [];

      if (user.name !== name) {
        changes.push(`nombre: ${user.name} -> ${name}`);
      }

      if (user.lastname !== lastname) {
        changes.push(`apellido: ${user.lastname} -> ${lastname}`);
      }

      if (changes.length > 0) {
        await user.update({ name, lastname }, { transaction: tx });

        const [logError, logDto] = LogEntityDto.create({
          userId: id,
          affected: user.id,
          entity: LogEntities.user,
          action: LogActions.user.update,
          description:
            `El usuario ${user.id} actualizó su información personal. ` +
            `Cambios: ${changes.join("; ")}.`,
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      const userSafe = await User.findByPk(id, {
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

  async attachSignatureImage(id: string, key: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const user = await User.findByPk(id, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!user) throw ERROR_CODES.USER_NOT_FOUND;

      if (user.signature === key) {
        await tx.commit();
        tx = undefined;

        return { success: true };
      }

      const hadPreviousSignature = Boolean(user.signature);

      await user.update({ signature: key }, { transaction: tx });

      const [logError, logDto] = LogEntityDto.create({
        userId: id,
        affected: user.id,
        entity: LogEntities.user,
        action: LogActions.user.updateSignature,
        description:
          `El usuario ${user.id} actualizó su firma digital. ` +
          `Firma anterior: ${
            hadPreviousSignature ? "Existente" : "No registrada"
          }. ` +
          `Firma nueva: Registrada.`,
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
}
