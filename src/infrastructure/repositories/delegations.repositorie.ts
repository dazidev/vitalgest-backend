import { OkPacketParams, RowDataPacket } from 'mysql2/promise';
import { DelegationRepoResponse, DelegationsRepositorieInterface, ERROR_CODES, RepoResponse } from '../../domain';
import { DelegationEntity } from '../../domain/entities/delegation.entity';
import { mysql, mysqlConfig } from '../config/msql.adapter';
import { binToUuid, uuidToBin } from '../config/uuid.adapter';


type DelegationRow = RowDataPacket & {
  id: Buffer;                 // BINARY(16)
  name: string;               // VARCHAR
  state_id: number;           // INT UNSIGNED
  municipality_id: number;    // INT UNSIGNED
  pharmacy_id: Buffer;        // BINARY(16) (según tu esquema actual)
}

const mapRow = (r: DelegationRow): DelegationRepoResponse => ({
  id: binToUuid(r.id),
  name: r.name,
  stateId: r.state_id,
  municipalityId: r.municipality_id,
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
      const query = 'SELECT * FROM states'
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
      const { id, name, stateId, municipalityId, pharmacyId } = delegationEntity

      const idDelegationToBin = uuidToBin(id!)
      const idPharmacyToBin = uuidToBin(pharmacyId!)

      const query = 'INSERT INTO delegations (id, name, state_id, municipality_id, pharmacy_id) VALUES (?, ?, ?, ?, ?)'
      const values = [idDelegationToBin, name, stateId, municipalityId, idPharmacyToBin] 
      const [results] = await connection.execute(query, values)

      const okResult = results as OkPacketParams

      if (okResult.affectedRows && okResult.affectedRows > 0) return { success: true, data: delegationEntity }
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
      const query = 
        amount === 'all' 
          ? 'SELECT * FROM delegations'
          : 'SELECT * FROM delegations LIMIT 1'
      const values = amount === 'all' ? [] : [Math.floor(Number(amount))]
      const [results] = await connection.execute<DelegationRow[]>(query, values)

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
      
      const query = 'SELECT * FROM delegations WHERE id = ? LIMIT 1'
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