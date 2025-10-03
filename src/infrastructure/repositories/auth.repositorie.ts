import { AuthRepositorieInterface, ERROR_CODES, RepoResponse, Role, UserRepoResponse } from "../../domain";
import { RowDataPacket } from 'mysql2/promise';
import { mysql, mysqlConfig } from '../config/msql.adapter';
import { binToUuid, uuidToBin } from "../config/uuid.adapter";

type UserRow = RowDataPacket & {
  id: Buffer,
  name: string,
  lastname: string,
  email: string,
  password: string,
  role: string,
  position: string,
  state: string
}

const mapUserRow = (r: UserRow): UserRepoResponse => ({
  id: binToUuid(r.id),
  name: r.name,
  lastname: r.lastname,
  email: r.email,
  password: r.password,
  role: r.role as Role,
  position: r.position,
  state: r.state
})

export class AuthRepositorie implements AuthRepositorieInterface {
  async getUser (email?: string, id?: string):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)

      const query = 
        id === undefined
          ? 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE email = ? LIMIT 1'
          : 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE id = ? LIMIT 1'

      const values = id === undefined ? [email] : [uuidToBin(id)]

      const [rows] = await connection.query<UserRow[]>(query, values)
      await connection.end()

      const data = rows.map(mapUserRow)

      if (data[0]) {
        return { success: true, data: data[0]};
      } 
      return { success: false, code: ERROR_CODES.USER_NOT_FOUND }

    } catch (error: any) {
      return { success: false, code: error };
    }
  }
};