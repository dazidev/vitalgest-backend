import { DelegationsRepositorieInterface, RepoResponse } from '../../domain';
import { mysql, mysqlConfig } from '../config/msql.adapter';


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
  
}