"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsRepositorie = void 0;
const domain_1 = require("../../domain");
const msql_adapter_1 = require("../config/msql.adapter");
const uuid_adapter_1 = require("../config/uuid.adapter");
const __1 = require("..");
const mapRow = (r) => ({
    id: (0, uuid_adapter_1.binToUuid)(r.id),
    name: r.name,
    state: {
        id: r.state_id,
        name: r.state_name,
    },
    municipality: {
        id: r.municipality_id,
        name: r.municipality_name,
    },
    pharmacyId: (0, uuid_adapter_1.binToUuid)(r.pharmacy_id),
});
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
        ORDER BY s.name`;
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
    async createDelegation(delegationEntity) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, name, stateId, stateName, municipalityId, municipalityName, pharmacyId } = delegationEntity;
            const idDelegationToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const idPharmacyToBin = (0, uuid_adapter_1.uuidToBin)(pharmacyId);
            const query = 'INSERT INTO delegations (id, name, state_id, municipality_id, pharmacy_id) VALUES (?, ?, ?, ?, ?)';
            const values = [idDelegationToBin, name, stateId, municipalityId, idPharmacyToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            const newDelegationEntity = {
                id,
                name,
                state: { id: stateId, name: stateName },
                municipality: { id: municipalityId, name: municipalityName },
                pharmacyId
            };
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true, data: newDelegationEntity };
            else
                return { success: false, code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async editDelegation(delegationEntity) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, name, stateId, municipalityId } = delegationEntity;
            const idToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const query = 'UPDATE delegations SET name = ?, state_id = ?, municipality_id = ? WHERE id = ?';
            const values = [name, stateId, municipalityId, idToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async deleteDelegation(delegationId) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(delegationId);
            const query = 'DELETE FROM delegations WHERE id = ? LIMIT 1';
            const values = [idToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.DELETE_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async createPharmacy(pharmacyId) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(pharmacyId);
            const query = 'INSERT INTO pharmacies (id) VALUES (?)';
            const values = [idToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true, pharmacyId };
            else
                return { success: false, code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async getDelegations(amount) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const plusQuery = amount === 'all'
                ? ''
                : `LIMIT ${(0, __1.toSafeInt)(amount)}`;
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
        ${plusQuery}`;
            const [results] = await connection.execute(query);
            const data = results.map(mapRow);
            return { success: true, data };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async getDelegation(delegationId) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(delegationId);
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
        LIMIT 1`;
            const values = [idToBin];
            const [results] = await connection.execute(query, values);
            const data = results.map(mapRow);
            return { success: true, data: data[0] };
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
