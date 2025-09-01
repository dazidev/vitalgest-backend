import { Request, Response, NextFunction } from "express";
import { AdmServiceInterface } from "../../domain/services/adm.service.interface";
import { CreateUserDto } from "../../application";
import { AdmRepositorie } from "../../infrastructure";
import { ERROR_CODES, RepoResponse, UserEntity } from "../../domain";

// librerias externas
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export class AdmService implements AdmServiceInterface {
  private readonly admRepo: AdmRepositorie;

  constructor () {
    this.admRepo = new AdmRepositorie();
  }

  public async createUser(createUserDto: CreateUserDto): Promise<object> {
    const { name, lastname, email, password, rol } = createUserDto;
  
    const existsUser = await this.admRepo.userExists(email);
    if (existsUser) throw { code: ERROR_CODES.EMAIL_ALREADY_REGISTERED };

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserEntity(userId, name, lastname, email, hashedPassword, rol);

    const process: RepoResponse = await this.admRepo.createUser(user);
    if (!process.success) throw { code: process.code };
    return { 
      success: true,
      data: {
        id: userId,
        name,
        lastname,
        email,
        rol,
        state: 1
      }
    };
  }


  editUser(_req: Request, _res: Response, _next: NextFunction): Promise<object> {
    throw new Error("Method not implemented.");
  }
  deleteUser(_req: Request, _res: Response, _next: NextFunction): Promise<object> {
    throw new Error("Method not implemented.");
  }
  getAllUsers(_req: Request, _res: Response, _next: NextFunction): Promise<object> {
    throw new Error("Method not implemented.");
  }
}