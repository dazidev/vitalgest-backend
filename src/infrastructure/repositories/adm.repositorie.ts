// TODO: https://sequelize.org/ REVISAR PARA MEJORAR LA EFICIENCIA DE LAS CONEXIONES
import { OkPacketParams, RowDataPacket } from 'mysql2';

import { AdmRepositorieInterface, ERROR_CODES, RepoResponse, Role, UserRepoResponse } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
import { mysql, mysqlConfig } from '../config/msql.adapter';
import { binToUuid, toSafeInt, uuidToBin } from '..';

type UserRow = RowDataPacket & {
  id: Buffer
  name: string
  lastname: string
  email: string
  role: string
  position: string
  state: string
  createdat: string
}

const mapUserRow = (r: UserRow): UserRepoResponse => ({
  id: binToUuid(r.id),
  name: r.name,
  lastname: r.lastname,
  email: r.email,
  role: r.role as Role,
  position: r.position,
  state: r.state,
  createdAt: r.createdat,
})


export class AdmRepositorie implements AdmRepositorieInterface {
  async userExists(email: string | undefined, id: string | undefined): Promise<boolean> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 
        email === undefined 
          ? 'SELECT EXISTS (SELECT 1 FROM users WHERE id = ?) AS registered'
          : 'SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS registered';

      const arg = 
        email === undefined 
          ? uuidToBin(id!)
          : email

      const [rows] = await connection.query(query, [arg])
      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      await connection.end()
      return !!row.registered
    } catch (error) {
      // TODO: que errores pueden haber? crear archivo de log?
      return false 
    }
  }

  async createUser (userEntityDto: UserEntity):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const id = ''
      const { name, lastname, email, password, role, position } = userEntityDto
      const query = 'INSERT INTO users (id, name, lastname, email, password, role, position, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, "true", NOW())'
      const values = [uuidToBin(id!), name, lastname, email, password, role, position]
      const [results] = await connection.query(query, values)
      await connection.end()

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.INSERT_FAILED }
    
    } catch (error: any) {
      return { success: false, code: error }
    }
  }

  async editUser(userEntityDto: UserEntity): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const id = ''
      const { name, lastname, email, role, position } = userEntityDto
      const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, role = ?, position = ? WHERE id = ?'
      const values = [name, lastname, email, role, position, uuidToBin(id!)];
      const [results] = await connection.query(query, values)
      await connection.end()

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.UPDATE_FAILED }
    
    } catch (error: any) {
      return { success: false, code: error }
    }
  }

  async deleteUser(id: string): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 'UPDATE users SET state = "false" WHERE id = ?'
      const values = [uuidToBin(id)];
      const [results] = await connection.query(query, values)
      await connection.end()

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.DELETE_FAILED }
    
    } catch (error: any) {
      return { success: false, code: error }
    }
  }

  async getAllUsers(amount: number | string): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)

      const plusQuery = 
        amount === 'all' 
          ? ''
          : `LIMIT ${toSafeInt(amount)}`

      const query = `SELECT id, name, lastname, email, role, position, state, createdat FROM users ORDER BY createdat DESC ${plusQuery}`
      const values = [amount];
      const [results] = await connection.execute<UserRow[]>(query, values)

      const data = results.map(mapUserRow)

      await connection.end()

      return {
        success: true,
        data: data
      }
    
    } catch (error: any) {
      return { success: false, code: error }
    }  
  }

  async changePasswordUser(id: string, password: string): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig);
      const query = 'UPDATE users SET password = ? WHERE id = ?';
      const values = [password, uuidToBin(id)];
      const [results] = await connection.query(query, values);
      await connection.end();

      const okResult = results as OkPacketParams;

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true };
      else return { success: false, code: ERROR_CODES.UPDATE_FAILED };

    } catch (error: any) {
      return { success: false, code: error };
    };  
  };

  async getUserById(id: string): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 'SELECT id, name, lastname, email, role, position, state, createdat FROM users WHERE id = ?'
      const values = [uuidToBin(id)];
      const [results] = await connection.execute<UserRow[]>(query, values)

      const data = results.map(mapUserRow)

      await connection.end()

      return {
        success: true,
        data: data[0]
      }
    
    } catch (error: any) {
      return { success: false, code: error }
    }
  }
};