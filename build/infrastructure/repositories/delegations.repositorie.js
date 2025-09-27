"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsRepositorie = void 0;
const msql_adapter_1 = require("../config/msql.adapter");
class DelegationsRepositorie {
    async stateExists(state) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'SELECT EXISTS (SELECT 1 FROM states WHERE id = ?) AS registered';
            const values = [state];
            const [results] = await connection.execute(query, values);
            const exist = Array.isArray(results) ? results[0] : results;
            return !!exist.registered;
        }
        catch (error) {
            return false;
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async getStates() {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'SELECT * FROM states';
            const [results] = await connection.execute(query);
            return { success: true, data: results };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async getMunicipalities(state) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'SELECT * FROM municipalities WHERE state_id = ?';
            const values = [state];
            const [results] = await connection.execute(query, values);
            return { success: true, data: results };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
}
exports.DelegationsRepositorie = DelegationsRepositorie;
