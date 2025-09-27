"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepositorie = void 0;
const domain_1 = require("../../domain");
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mysqlConfig = {
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: { minVersion: 'TLSv1.2' }, // conexion cifrada
};
class AuthRepositorie {
    async getUser(email, id) {
        try {
            const connection = await promise_1.default.createConnection(mysqlConfig);
            const query = id === undefined
                ? 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE email = ? LIMIT 1'
                : 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE id = ? LIMIT 1';
            const values = id === undefined ? [email] : [id];
            const [rows] = await connection.query(query, values);
            await connection.end();
            if (rows[0]) {
                return { success: true, data: rows[0] };
            }
            return { success: false, code: domain_1.ERROR_CODES.USER_NOT_FOUND };
        }
        catch (error) {
            return { success: false, code: error };
        }
    }
}
exports.AuthRepositorie = AuthRepositorie;
;
