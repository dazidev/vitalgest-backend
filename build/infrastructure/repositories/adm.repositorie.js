"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRepositorie = void 0;
// TODO: https://sequelize.org/ REVISAR PARA MEJORAR LA EFICIENCIA DE LAS CONEXIONES
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = require("dotenv");
const domain_1 = require("../../domain");
(0, dotenv_1.config)();
const mysqlConfig = {
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: { minVersion: 'TLSv1.2' }, // conexion cifrada
};
class AdmRepositorie {
    async userExists(email, id) {
        try {
            const connection = await promise_1.default.createConnection(mysqlConfig);
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
            return false; // TODO: que errores pueden haber? crear archivo de log?
        }
    }
    async createUser(userEntityDto) {
        try {
            const connection = await promise_1.default.createConnection(mysqlConfig);
            const { id, name, lastname, email, password, rol } = userEntityDto;
            const query = 'INSERT INTO users (id, name, lastname, email, password, rol, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())';
            const values = [id, name, lastname, email, password, rol];
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
            const connection = await promise_1.default.createConnection(mysqlConfig);
            const { id, name, lastname, email, rol } = userEntityDto;
            const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, rol = ? WHERE id = ?';
            const values = [name, lastname, email, rol, id];
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
            const connection = await promise_1.default.createConnection(mysqlConfig);
            const query = 'UPDATE users SET state = 0 WHERE id = ?';
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
            const connection = await promise_1.default.createConnection(mysqlConfig);
            const query = 'SELECT id, name, lastname, email, rol, state, createdat FROM users ORDER BY createdat DESC LIMIT ?';
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
            const connection = await promise_1.default.createConnection(mysqlConfig);
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
}
exports.AdmRepositorie = AdmRepositorie;
;
