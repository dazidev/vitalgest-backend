import { sequelize, User } from "../../infrastructure";
import { ERROR_CODES } from "../../domain";

// librerias externas
import bcrypt from "bcrypt";
import { Transaction } from "sequelize";
import { config } from "dotenv";

config();

export class UserService {
  async changePassword(
    id: string,
    currentPass: string,
    newPass: string,
  ): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      const isMatching = await bcrypt.compare(currentPass!, exists.password!);
      if (!isMatching) throw ERROR_CODES.CREDENTIALS_NOT_MATCH;

      const hashedPassword = await bcrypt.hash(newPass as string, 10);

      await User.update(
        { password: hashedPassword },
        { where: { id }, transaction: tx },
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

  public async changeInfo(
    id: string,
    name: string,
    lastname: string,
  ): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      await User.update(
        {
          name,
          lastname,
        },
        { where: { id }, transaction: tx },
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

  public async attachSignatureImage(id: string, key: string) {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const exists = await User.findOne({ where: { id }, transaction: tx });
      if (!exists) throw ERROR_CODES.USER_NOT_FOUND;

      await User.update(
        {
          signature: key,
        },
        { where: { id }, transaction: tx },
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
}
