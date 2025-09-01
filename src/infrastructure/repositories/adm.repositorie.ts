
import mysql from 'mysql2/promise';
import { OkPacketParams } from 'mysql2';

import { config } from 'dotenv';
import { AdmRepositorieInterface, ERROR_CODES, RepoResponse } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';

config()

const mysqlConfig: mysql.ConnectionOptions = {
  host: process.env.HOST,
  user: process.env.USER_NAME,
  port: 3306,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

export class AdmRepositorie implements AdmRepositorieInterface {

  async userExists(email: string): Promise<boolean> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const query = 'SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS registered'
      const [rows] = await connection.query(query, [email])
      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      return !!row.registered
    } catch (error) {
      return false // TODO: que errores pueden haber? crear archivo de log?
    }
  }

  async createUser (userEntityDto: UserEntity):Promise<RepoResponse> {
    try {
      const connection = await mysql.createConnection(mysqlConfig)
      const { id, name, lastname, email, password, rol } = userEntityDto
      const query = 'INSERT INTO users (id, name, lastname, email, password, rol, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())'
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
}