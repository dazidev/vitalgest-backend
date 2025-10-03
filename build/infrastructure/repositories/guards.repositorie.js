"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsRepositorie = void 0;
const domain_1 = require("../../domain");
const msql_adapter_1 = require("../config/msql.adapter");
const uuid_adapter_1 = require("../config/uuid.adapter");
const validators_helper_1 = require("../helpers/validators.helper");
const mapRow = (r) => ({
    id: (0, uuid_adapter_1.binToUuid)(r.id),
    date: (0, validators_helper_1.toStringDate)(r.date),
    state: (0, validators_helper_1.getGuardState)(new Date((0, validators_helper_1.toStringDate)(r.date))),
    guardChief: {
        id: (0, uuid_adapter_1.binToUuid)(r.chief_id),
        name: r.chief_name,
        lastname: r.chief_lastname,
        email: r.chief_email
    },
    delegation: {
        id: (0, uuid_adapter_1.binToUuid)(r.delegation_id),
        name: r.delegation_name
    }
});
class GuardsRepositorie {
    async existsGuard(date, delegationId) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(delegationId);
            const query = 'SELECT EXISTS (SELECT 1 FROM guards WHERE date = ? AND delegation_id = ?) AS registered';
            const values = [date, idToBin];
            const [rows] = await connection.execute(query, values);
            const row = Array.isArray(rows) ? rows[0] : rows;
            return !!row.registered;
        }
        catch (error) {
            return false;
        }
        finally {
            if (connection)
                connection.end();
        }
    }
    async existsDelegation(id) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const query = 'SELECT EXISTS (SELECT 1 FROM delegations WHERE id = ?) AS registered';
            const values = [idToBin];
            const [rows] = await connection.execute(query, values);
            const row = Array.isArray(rows) ? rows[0] : rows;
            return !!row.registered;
        }
        catch (error) {
            return false;
        }
        finally {
            if (connection)
                connection.end();
        }
    }
    async isGuardChief(id) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            // todo: cambiar a bin el uuid
            const query = 'SELECT EXISTS (SELECT 1 FROM users WHERE id = ? AND role = "head_guard") AS registered';
            const values = [(0, uuid_adapter_1.uuidToBin)(id)];
            const [rows] = await connection.execute(query, values);
            const row = Array.isArray(rows) ? rows[0] : rows;
            return !!row.registered;
        }
        catch (error) {
            return false;
        }
        finally {
            if (connection)
                connection.end();
        }
    }
    async createGuard(guardsEntityDto) {
        let connection;
        try {
            const { id, guardChief, date, delegationId } = guardsEntityDto;
            const idGuardToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const idDelegationToBin = (0, uuid_adapter_1.uuidToBin)(delegationId);
            const guardChiefToBin = (0, uuid_adapter_1.uuidToBin)(guardChief);
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'INSERT INTO guards (id, guard_chief, date, delegation_id) VALUES (?, ?, ?, ?)';
            const values = [idGuardToBin, guardChiefToBin, date, idDelegationToBin];
            const [results] = await connection.execute(query, values);
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true, data: guardsEntityDto };
            else
                return { success: false, code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                connection.end();
        }
    }
    async editGuard(guardsEntityDto) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, guardChief, date, delegationId } = guardsEntityDto;
            const idToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const idDeleToBin = (0, uuid_adapter_1.uuidToBin)(delegationId);
            const idGuardToBin = (0, uuid_adapter_1.uuidToBin)(guardChief);
            const query = 'UPDATE guards SET guard_chief = ?, date = ?, delegation_id = ? WHERE id = ?';
            const values = [idGuardToBin, date, idDeleToBin, idToBin];
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
    async deleteGuard(id) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(id);
            const query = 'DELETE FROM guards WHERE id = ? LIMIT 1';
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
    async getGuards(amount) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const plusQuery = amount === 'all'
                ? ''
                : `LIMIT ${(0, validators_helper_1.toSafeInt)(amount)}`;
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
            const [results] = await connection.execute(query);
            const data = results.map(mapRow);
            return { success: true, data: data };
        }
        catch (error) {
            return { success: false, code: error };
        }
        finally {
            if (connection)
                await connection.end();
        }
    }
    async getOneGuard(id) {
        let connection;
        try {
            connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const idToBin = (0, uuid_adapter_1.uuidToBin)(id);
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
exports.GuardsRepositorie = GuardsRepositorie;
