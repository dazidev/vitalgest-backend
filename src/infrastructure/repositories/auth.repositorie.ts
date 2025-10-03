import { AuthRepositorieInterface, ERROR_CODES, RepoResponse } from "../../domain";
import { RowDataPacket } from 'mysql2/promise';
import { mysql, mysqlConfig } from '../config/msql.adapter';
import { uuidToBin } from "../config/uuid.adapter";

export class AuthRepositorie implements AuthRepositorieInterface {
  async getUser (email?: string, id?: string):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)

      const query = 
        id === undefined
          ? 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE email = ? LIMIT 1'
          : 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE id = ? LIMIT 1'

      const values = id === undefined ? [email] : [uuidToBin(id)]

      const [rows] = await connection.query<RowDataPacket[]>(query, values)
      await connection.end()

      if (rows[0]) {
        return { success: true, data: rows[0]};
      } 
      return { success: false, code: ERROR_CODES.USER_NOT_FOUND }

    } catch (error: any) {
      return { success: false, code: error };
    }
  }
};