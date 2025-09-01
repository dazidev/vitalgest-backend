
import { Request, Response, NextFunction } from "express";
import { CreateUserDto } from "../../application";

export interface AdmServiceInterface {
  createUser (createUserDto: CreateUserDto): Promise<object>;
  editUser (req: Request, res: Response, next: NextFunction): Promise<object>;
  deleteUser (req: Request, res: Response, next: NextFunction): Promise<object>;
  getAllUsers (req: Request, res: Response, next: NextFunction): Promise<object>;
};