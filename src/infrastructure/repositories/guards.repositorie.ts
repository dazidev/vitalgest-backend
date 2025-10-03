import { ERROR_CODES, GuardRepoResponse, GuardsRepositorieInterface, RepoResponse } from "../../domain";
import { mysql, mysqlConfig } from "../config/msql.adapter";
import { GuardsEntityDto } from '../../application/dtos/guard-entity.dto';
import { OkPacketParams, RowDataPacket } from "mysql2/promise";
import { binToUuid, uuidToBin } from '../config/uuid.adapter';
import { getGuardState, toSafeInt, toStringDate } from "../helpers/validators.helper";


type GuardRow = RowDataPacket & {
  id: Buffer
  chief_id: Buffer
  chief_name: string
  chief_lastname: string
  chief_email: string
  date: Date
  delegation_id: Buffer
  delegation_name: string
}

const mapRow = (r: GuardRow): GuardRepoResponse => ({
  id: binToUuid(r.id),
  date: toStringDate(r.date),
  state: getGuardState(new Date(toStringDate(r.date))),
  guardChief: {
    id: binToUuid(r.chief_id),
    name: r.chief_name,
    lastname: r.chief_lastname,
    email: r.chief_email
  },
  delegation: {
    id: binToUuid(r.delegation_id),
    name: r.delegation_name
  }
})


export class GuardsRepositorie implements GuardsRepositorieInterface {
  async existsGuard(date: string, delegationId: string): Promise<boolean> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const idToBin = uuidToBin(delegationId)
      const query = 'SELECT EXISTS (SELECT 1 FROM guards WHERE date = ? AND delegation_id = ?) AS registered'

      const values = [date, idToBin]

      const [rows] = await connection.execute(query, values)

      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      return !!row.registered
    } catch (error) {
      return false 
    } finally {
      if (connection) connection.end()
    }
  }

  async existsDelegation(id: string): Promise<boolean> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const idToBin = uuidToBin(id)
      const query = 'SELECT EXISTS (SELECT 1 FROM delegations WHERE id = ?) AS registered'

      const values = [idToBin]

      const [rows] = await connection.execute(query, values)

      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      return !!row.registered
    } catch (error) {
      return false 
    } finally {
      if (connection) connection.end()
    }
  }

  async isGuardChief(id: string): Promise<boolean> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      // todo: cambiar a bin el uuid
      const query = 'SELECT EXISTS (SELECT 1 FROM users WHERE id = ? AND role = "head_guard") AS registered'

      const values = [uuidToBin(id)]

      const [rows] = await connection.execute(query, values)

      const row = Array.isArray(rows) ? rows[0] as any : rows as any
      return !!row.registered
    } catch (error) {
      return false 
    } finally {
      if (connection) connection.end()
    }
  }

  async createGuard(guardsEntityDto: GuardsEntityDto): Promise<RepoResponse> {
    let connection
    try {
      const { id, guardChief, date, delegationId } = guardsEntityDto

      const idGuardToBin = uuidToBin(id!)
      const idDelegationToBin = uuidToBin(delegationId!)
      const guardChiefToBin = uuidToBin(guardChief!)

      connection = await mysql.createConnection(mysqlConfig)
      const query = 'INSERT INTO guards (id, guard_chief, date, delegation_id) VALUES (?, ?, ?, ?)'
      const values = [ idGuardToBin, guardChiefToBin, date, idDelegationToBin ]

      const [results] = await connection.execute(query, values)

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true, data: guardsEntityDto }
      else return { success: false, code: ERROR_CODES.INSERT_FAILED }

    } catch (error: any) {
      return { success: false, code: error }
    } finally {
      if (connection) connection.end()
    }
  }

  async editGuard(guardsEntityDto: GuardsEntityDto): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const { id, guardChief, date, delegationId } = guardsEntityDto

      const idToBin = uuidToBin(id!)
      const idDeleToBin = uuidToBin(delegationId!)
      const idGuardToBin = uuidToBin(guardChief!)

      const query = 'UPDATE guards SET guard_chief = ?, date = ?, delegation_id = ? WHERE id = ?'
      const values = [idGuardToBin, date, idDeleToBin, idToBin];
      const [results] = await connection.execute(query, values)

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.UPDATE_FAILED }
    
    } catch (error: any) {
      return { success: false, code: error }
    } finally {
      if (connection) await connection.end()
    }
  }

  async deleteGuard(id: string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)

      const idToBin = uuidToBin(id)

      const query = 'DELETE FROM guards WHERE id = ? LIMIT 1'
      const values = [idToBin]
      const [results] = await connection.execute(query, values)

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true }
      else return { success: false, code: ERROR_CODES.DELETE_FAILED }
      
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }

  async getGuards(amount: number | string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
    
      const plusQuery = 
        amount === 'all' 
          ? ''
          : `LIMIT ${toSafeInt(amount)}`

      const query = `
        SELECT
          g.id,
          u.id AS chief_id,
          u.name AS chief_name,
          u.lastname AS chief_lastname,
          u.email AS chief_email,
          g.date,
          d.id AS delegation_id,
          d.name AS delegation_name
        FROM guards g
        INNER JOIN users u        ON u.id = g.guard_chief
        INNER JOIN delegations d  ON d.id = g.delegation_id
        ${plusQuery}
      `;
    
      const [results] = await connection.execute<GuardRow[]>(query)
    
      const data = results.map(mapRow);
    
      return { success: true, data: data  }
    } catch (error: any) {
      return { success: false, code: error }
    } finally {
      if (connection) await connection.end()
    }
  }

  async getOneGuard(id: string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      
      const idToBin = uuidToBin(id)

      const query = `
        SELECT
          g.id,
          u.id AS chief_id,
          u.name AS chief_name,
          u.lastname AS chief_lastname,
          u.email AS chief_email,
          g.date,
          d.id AS delegation_id,
          d.name AS delegation_name
        FROM guards g
        INNER JOIN users u        ON u.id = g.guard_chief
        INNER JOIN delegations d  ON d.id = g.delegation_id
        WHERE g.id = ?
        LIMIT 1
      `;

      const values = [idToBin]
      const [results] = await connection.execute<GuardRow[]>(query, values)

      const data = results.map(mapRow);
    
      return { success: true, data: data[0]  }
    } catch (error: any) {
      return { success: false, code: error }
    } finally {
      if (connection) await connection.end()
    }
  }
}