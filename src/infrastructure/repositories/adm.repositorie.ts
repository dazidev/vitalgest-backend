// TODO: https://sequelize.org/ REVISAR PARA MEJORAR LA EFICIENCIA DE LAS CONEXIONES
import mysql from 'mysql2/promise';
import { OkPacketParams } from 'mysql2';

import { config } from 'dotenv';
import { AdmRepositorieInterface, ERROR_CODES, RepoResponse } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';

config()

const mysqlConfig: mysql.ConnectionOptions = {
  host: process.env.HOST,
  port: process.env.PORT_DB as unknown as number,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: { minVersion: 'TLSv1.2' }, // conexion cifrada
}

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
          ? id
          : email

      const [rows] = await connection.query(query, [arg])
      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      await connection.end()
      return !!row.registered
    } catch (error) {
      return false // TODO: que errores pueden haber? crear archivo de log?
    }
  }

  async createUser (userEntityDto: UserEntity):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const { id, name, lastname, email, password, rol } = userEntityDto
      const query = 'INSERT INTO users (id, name, lastname, email, password, rol, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())'
      const values = [id, name, lastname, email, password, rol]
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
      const { id, name, lastname, email, rol } = userEntityDto
      const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, rol = ? WHERE id = ?'
      const values = [name, lastname, email, rol, id];
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
      const query = 'UPDATE users SET state = 0 WHERE id = ?'
      const values = [id];
      const [results] = await connection.query(query, values)
      await connection.end()

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.DELETE_FAILED }
    
    } catch (error: any) {
      return { success: false, code: error }
    }
  }

  async getAllUsers(amount: number): Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 'SELECT id, name, lastname, email, rol, state, createdat FROM users ORDER BY createdat DESC LIMIT ?'
      const values = [amount];
      const [results] = await connection.query(query, values)
      await connection.end()

      return {
        success: true,
        data: results
      }
    
    } catch (error: any) {
      return { success: false, code: error }
    }  
  }
}