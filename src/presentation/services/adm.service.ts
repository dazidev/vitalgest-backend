import { AdmServiceInterface } from "../../domain/services/adm.service.interface";
import { AdmRepositorie } from "../../infrastructure";
import { UserEntityDto } from "../../application";
import { ERROR_CODES, RepoResponse, UserEntity } from "../../domain";

// librerias externas
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export class AdmService implements AdmServiceInterface {
  private readonly admRepo: AdmRepositorie;

  constructor () {
    this.admRepo = new AdmRepositorie();
  }

  public async createUser(userEntityDto: UserEntityDto): Promise<object> {
    const { name, lastname, email, password, role, position } = userEntityDto;
  
    const existsUser = await this.admRepo.userExists(email, undefined);
    if (existsUser) throw { code: ERROR_CODES.EMAIL_ALREADY_REGISTERED };

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = new UserEntity(userId, name, lastname, email, hashedPassword, role, position);

    const process: RepoResponse = await this.admRepo.createUser(user);
    if (!process.success) throw { code: process.code };
    return { 
      success: true,
      data: {
        id: userId,
        name,
        lastname,
        email,
        role,
        position,
        state: "true"
      }
    };
  }

  public async editUser(userEntityDto: UserEntityDto): Promise<object> {
    const { id, name, lastname, email, role, position } = userEntityDto;

    const existsUser = await this.admRepo.userExists(undefined, id);
    if (!existsUser) throw { code: ERROR_CODES.USER_NOT_FOUND };

    const user = new UserEntity(id as string, name, lastname, email, role, position);

    const process: RepoResponse = await this.admRepo.editUser(user);
    if (!process.success) throw { code: process.code };
    return { 
      success: true,
      data: {
        id,
        name,
        lastname,
        email,
        role,
        position
      }
    };
  }

  async deleteUser(id: string): Promise<object> {
    const existsUser = await this.admRepo.userExists(undefined, id);
    if (!existsUser) throw { code: ERROR_CODES.USER_NOT_FOUND };

    const process: RepoResponse = await this.admRepo.deleteUser(id);
    if (!process.success) throw { code: process.code };

    return { success: true }
  }

  async getAllUsers(amount: number): Promise<object> {
    const process: RepoResponse = await this.admRepo.getAllUsers(amount);
    if (!process.success) throw { code: process.code };

    return { 
      success: true,
      data: process.data
    }
  }

  async changePasswordUser(id: string, password: string): Promise<object> {
    const existsUser = await this.admRepo.userExists(undefined, id);
    if (!existsUser) throw { code: ERROR_CODES.USER_NOT_FOUND };

    const hashedPassword = await bcrypt.hash(password as string, 10);    
    
    const process: RepoResponse = await this.admRepo.changePasswordUser(id, hashedPassword);
    if (!process.success) throw { code: process.code };

    return { success: true }
  }
}