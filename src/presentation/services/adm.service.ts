import { AdmServiceInterface } from "../../domain/services/adm.service.interface";
import { sequelize, User } from "../../infrastructure";
import { UserEntityDto } from "../../application";
import { ERROR_CODES, UserEntity } from "../../domain";

// librerias externas
import bcrypt from 'bcrypt'
import { Transaction } from "sequelize";


export class AdmService implements AdmServiceInterface {

  public async createUser(userEntityDto: UserEntityDto): Promise<object> {
    let tx: Transaction | undefined;
    const { name, lastname, email, password, role, position, delegationId: delegation_id } = userEntityDto;

    try {
      tx = await sequelize.transaction();
      const exists = await User.findOne({ where: { email: email }, transaction: tx })
      if (exists) throw { code: ERROR_CODES.EMAIL_ALREADY_REGISTERED }

      const hashedPassword = await bcrypt.hash(password as string, 10);

      const UserHashed = { name, lastname, email, hashedPassword, role, position, delegation_id }

      const userEntity = UserEntity.create(UserHashed);

      const user = await User.create({
        name: userEntity.name!,
        lastname: userEntity.lastname!,
        email: userEntity.email!,
        password: userEntity.password!,
        status: true,
        role: userEntity.role!,
        position: userEntity.position!,
        delegation_id: userEntity.delegation_id!,
      }, { transaction: tx })

      await tx.commit()
      
      const userSafe = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      })

      return {
        success: true,
        data: userSafe
      }
      
    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.INSERT_FAILED }
    }
  }

  public async editUser(userEntityDto: UserEntityDto): Promise<object> {
    const { id, name, lastname, email, role, position, delegationId } = userEntityDto;
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const exists = await User.findOne({ where: { id }, transaction: tx })
      if (!exists) throw { code: ERROR_CODES.USER_NOT_FOUND }

      await User.update({
        name,
        lastname,
        email,
        role,
        position,
        delegation_id: delegationId
      }, { where: { id }, transaction: tx })

      await tx.commit()

      const userSafe = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      })

      return {
        success: true,
        data: userSafe
      }

    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }
  }

  async deleteUser(id: string): Promise<object> {
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const exists = await User.findOne({ where: { id }, transaction: tx })
      if (!exists) throw { code: ERROR_CODES.USER_NOT_FOUND }

      await User.update({ status: false }, { where: { id }, transaction: tx })

      await tx.commit()

      return { success: true }

    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.DELETE_FAILED }
    }
  }

  async getAllUsers(amount: string): Promise<object> {
    let newAmount
    if (amount !== 'all') newAmount = parseInt(amount)
    else newAmount = amount

    try {
      let users

      newAmount === 'all'
        ? users = await User.findAll({ attributes: { exclude: ['password'] } })
        : users = await User.findAll({ limit: newAmount as number, attributes: { exclude: ['password'] } })

      return { 
        success: true,
        data: users 
      }

    } catch (error) {
      throw { code: ERROR_CODES.USER_NOT_FOUND }
    }
  }

  async changePasswordUser(id: string, password: string): Promise<object> {
    let tx: Transaction | undefined

    try {
      tx = await sequelize.transaction()

      const exists = await User.findOne({ where: { id }, transaction: tx })
      if (!exists) throw { code: ERROR_CODES.USER_NOT_FOUND }

      const hashedPassword = await bcrypt.hash(password as string, 10); 

      await User.update({ password: hashedPassword }, { where: { id }, transaction: tx })

      await tx.commit()

      return {
        success: true
      }

    } catch (error) {
      await tx?.rollback()
      throw { code: ERROR_CODES.UPDATE_FAILED }
    }
  }

  async getUserById(id: string): Promise<object> {

    try {
      const user = await User.findOne({ where: { id }, attributes: { exclude: ['password']} })
      if (!user) throw { code: ERROR_CODES.USER_NOT_FOUND }

      return {
        success: true,
        data: user
      }
    } catch (error) {
      throw { code: ERROR_CODES.USER_NOT_FOUND } // todo: cambiar a error en la busqueda 
    }
  }
}