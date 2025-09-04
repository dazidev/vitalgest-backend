import { AuthRepositorieInterface, ERROR_CODES, RepoResponse } from "../../domain";
import mysql, { RowDataPacket } from 'mysql2/promise';

import { config } from 'dotenv';

config()

const mysqlConfig: mysql.ConnectionOptions = {
  host: process.env.HOST,
  port: process.env.PORT_DB as unknown as number,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: { minVersion: 'TLSv1.2' }, // conexion cifrada
}

export class AuthRepositorie implements AuthRepositorieInterface {
  async getUser (email?: string, id?: string):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 
        id === undefined
          ? 'SELECT id, name, lastname, email, password, role, state FROM users WHERE email = ? LIMIT 1'
          : 'SELECT id, name, lastname, email, password, role, state FROM users WHERE id = ? LIMIT 1'

      const values = id === undefined ? [email] : [id]

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