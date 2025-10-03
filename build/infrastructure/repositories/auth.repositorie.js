"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepositorie = void 0;
const domain_1 = require("../../domain");
const msql_adapter_1 = require("../config/msql.adapter");
const uuid_adapter_1 = require("../config/uuid.adapter");
class AuthRepositorie {
    async getUser(email, id) {
        try {
            const connection = await msql_adapter_1.mysql.createConnection(msql_adapter_1.mysqlConfig);
            const query = id === undefined
                ? 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE email = ? LIMIT 1'
                : 'SELECT id, name, lastname, email, password, role, position, state FROM users WHERE id = ? LIMIT 1';
            const values = id === undefined ? [email] : [(0, uuid_adapter_1.uuidToBin)(id)];
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
