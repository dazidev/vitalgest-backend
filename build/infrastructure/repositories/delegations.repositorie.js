"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsRepositorie = void 0;
const domain_1 = require("../../domain");
const msql_adapter_1 = require("../config/msql.adapter");
const uuid_adapter_1 = require("../config/uuid.adapter");
const mapRow = (r) => ({
    id: (0, uuid_adapter_1.binToUuid)(r.id),
    name: r.name,
    stateId: r.state_id,
    municipalityId: r.municipality_id,
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
    async createDelegation(delegationEntity) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, name, stateId, municipalityId, pharmacyId } = delegationEntity;
            const idDelegationToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const idPharmacyToBin = (0, uuid_adapter_1.uuidToBin)(pharmacyId);
            const query = 'INSERT INTO delegations (id, name, state_id, municipality_id, pharmacy_id) VALUES (?, ?, ?, ?, ?)';
            const values = [idDelegationToBin, name, stateId, municipalityId, idPharmacyToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true, data: delegationEntity };
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
            const query = amount === 'all'
                ? 'SELECT * FROM delegations'
                : 'SELECT * FROM delegations LIMIT 1';
            const values = amount === 'all' ? [] : [Math.floor(Number(amount))];
            const [results] = await connection.execute(query, values);
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
            const query = 'SELECT * FROM delegations WHERE id = ? LIMIT 1';
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
