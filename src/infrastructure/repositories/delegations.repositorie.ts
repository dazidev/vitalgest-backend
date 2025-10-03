import { OkPacketParams, RowDataPacket } from 'mysql2/promise';
import { DelegationRepoResponse, DelegationsRepositorieInterface, ERROR_CODES, RepoResponse } from '../../domain';
import { DelegationEntity } from '../../domain/entities/delegation.entity';
import { mysql, mysqlConfig } from '../config/msql.adapter';
import { binToUuid, uuidToBin } from '../config/uuid.adapter';
import { toSafeInt } from '..';


type DelegationRow = RowDataPacket & {
  id: Buffer
  name: string
  state_id: number
  state_name: string
  municipality_id: number
  municipality_name: string
  pharmacy_id: Buffer
}

const mapRow = (r: DelegationRow): DelegationRepoResponse => ({
  id: binToUuid(r.id),
  name: r.name,
  state: {
    id: r.state_id,
    name: r.state_name,
  },
  municipality: {
    id: r.municipality_id,
    name: r.municipality_name,
  },
  pharmacyId: binToUuid(r.pharmacy_id),
})

export class DelegationsRepositorie implements DelegationsRepositorieInterface {
  
  async stateExists(state: number): Promise<boolean> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)  
      const query = 'SELECT EXISTS (SELECT 1 FROM states WHERE id = ?) AS registered'
      const values = [state] 
      const [results] = await connection.execute(query, values)

      const exist = Array.isArray(results) ? results[0] as any : results as any
      return !!exist.registered
    } catch (error: any) {
      return false
    } finally {
      if (connection) await connection.end()
    }
  }

  async getStates(): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const query = `
        SELECT
          s.id,
          s.name,
          JSON_ARRAYAGG(
            JSON_OBJECT('id', m.id, 'name', m.name)
          ) AS municipalities
        FROM states s
        LEFT JOIN municipalities m ON m.state_id = s.id
        GROUP BY s.id, s.name
        ORDER BY s.name`

      const [results] = await connection.execute(query)

      return { success: true, data: results }
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }
  
  async getMunicipalities(state: number): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const query = 'SELECT * FROM municipalities WHERE state_id = ?'
      const values = [state] 
      const [results] = await connection.execute(query, values)
      
      return { success: true, data: results }
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }

  async createDelegation(delegationEntity: DelegationEntity): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const { id, name, stateId, stateName,  municipalityId, municipalityName,  pharmacyId } = delegationEntity

      const idDelegationToBin = uuidToBin(id!)
      const idPharmacyToBin = uuidToBin(pharmacyId!)

      const query = 'INSERT INTO delegations (id, name, state_id, municipality_id, pharmacy_id) VALUES (?, ?, ?, ?, ?)'
      const values = [idDelegationToBin, name, stateId, municipalityId, idPharmacyToBin] 
      const [results] = await connection.execute(query, values)
  
      const okResult = results as OkPacketParams

      const newDelegationEntity = {
        id,
        name,
        state: { id: stateId, name: stateName },
        municipality: { id: municipalityId, name: municipalityName },
        pharmacyId
      }
      
      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true, data: newDelegationEntity }
      else return { success: false, code: ERROR_CODES.INSERT_FAILED }
      
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }

  async editDelegation(delegationEntity: DelegationEntity): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)
      const { id, name, stateId, municipalityId } = delegationEntity

      const idToBin = uuidToBin(id!)

      const query = 'UPDATE delegations SET name = ?, state_id = ?, municipality_id = ? WHERE id = ?'
      const values = [name, stateId, municipalityId, idToBin];
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
  
  async deleteDelegation(delegationId: string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)

      const idToBin = uuidToBin(delegationId)

      const query = 'DELETE FROM delegations WHERE id = ? LIMIT 1'
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

  async createPharmacy(pharmacyId: string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)

      const idToBin = uuidToBin(pharmacyId)

      const query = 'INSERT INTO pharmacies (id) VALUES (?)'
      const values = [idToBin]
      const [results] = await connection.execute(query, values)

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true, pharmacyId }
      else return { success: false, code: ERROR_CODES.INSERT_FAILED }
      
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }

  async getDelegations(amount: number | string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)

      const plusQuery = 
        amount === 'all' 
          ? ''
          : `LIMIT ${toSafeInt(amount)}`

      const query = `
        SELECT
          d.id,
          d.name,
          d.state_id,
          s.name AS state_name,
          d.municipality_id,
          m.name AS municipality_name,
          d.pharmacy_id
        FROM delegations d
        INNER JOIN states s ON s.id = d.state_id
        INNER JOIN municipalities m ON m.id = d.municipality_id
        ${plusQuery}`

      const [results] = await connection.execute<DelegationRow[]>(query)

      const data = results.map(mapRow);

      return { success: true, data }
    } catch (error: any) {
      return { success: false, code: error }
    } finally {
      if (connection) await connection.end()
    }
  }

  async getDelegation(delegationId: string): Promise<RepoResponse> {
    let connection
    try {
      connection = await mysql.createConnection(mysqlConfig)

      const idToBin = uuidToBin(delegationId)
      
      const query = `
        SELECT
          d.id,
          d.name,
          d.state_id,
          s.name AS state_name,
          d.municipality_id,
          m.name AS municipality_name,
          d.pharmacy_id
        FROM delegations d
        INNER JOIN states s ON s.id = d.state_id
        INNER JOIN municipalities m ON m.id = d.municipality_id
        WHERE d.id = ? 
        LIMIT 1`

      const values = [idToBin] 
      const [results] = await connection.execute<DelegationRow[]>(query, values)

      const data = results.map(mapRow);

      return { success: true, data: data[0] }
    } catch (error: any) {
      return { success: false, code: error}
    } finally {
      if (connection) await connection.end()
    }
  }
}