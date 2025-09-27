"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRepositorie = void 0;
const domain_1 = require("../../domain");
const msql_adapter_1 = require("../config/msql.adapter");
class AdmRepositorie {
    async userExists(email, id) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = email === undefined
                ? 'SELECT EXISTS (SELECT 1 FROM users WHERE id = ?) AS registered'
                : 'SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS registered';
            const arg = email === undefined
                ? id
                : email;
            const [rows] = await connection.query(query, [arg]);
            const row = Array.isArray(rows) ? rows[0] : rows;
            await connection.end();
            return !!row.registered;
        }
        catch (error) {
            // TODO: que errores pueden haber? crear archivo de log?
            return false;
        }
    }
    async createUser(userEntityDto) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, name, lastname, email, password, role, position } = userEntityDto;
            const query = 'INSERT INTO users (id, name, lastname, email, password, role, position, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, "true", NOW())';
            const values = [id, name, lastname, email, password, role, position];
            const [results] = await connection.query(query, values);
            await connection.end();
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
    async editUser(userEntityDto) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const { id, name, lastname, email, role, position } = userEntityDto;
            const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, role = ?, position = ? WHERE id = ?';
            const values = [name, lastname, email, role, position, id];
            const [results] = await connection.query(query, values);
            await connection.end();
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
    async deleteUser(id) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'UPDATE users SET state = "false" WHERE id = ?';
            const values = [id];
            const [results] = await connection.query(query, values);
            await connection.end();
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.DELETE_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
    async getAllUsers(amount) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'SELECT id, name, lastname, email, role, position, state, createdat FROM users ORDER BY createdat DESC LIMIT ?';
            const values = [amount];
            const [results] = await connection.query(query, values);
            await connection.end();
            return {
                success: true,
                data: results
            };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
    async changePasswordUser(id, password) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'UPDATE users SET password = ? WHERE id = ?';
            const values = [password, id];
            const [results] = await connection.query(query, values);
            await connection.end();
            const okResult = results;
            if (okResult.affectedRows && okResult.affectedRows > 0)
                return { success: true };
            else
                return { success: false, code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
        catch (error) {
            return { success: false, code: error };
        }
        ;
    }
    ;
    async getUserById(id) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = 'SELECT id, name, lastname, email, role, position, state, createdat FROM users WHERE id = ?';
            const values = [id];
            const [results] = await connection.query(query, values);
            await connection.end();
            return {
                success: true,
                data: results
            };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
}
exports.AdmRepositorie = AdmRepositorie;
;
