"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql = exports.mysqlConfig = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.mysql = promise_1.default;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.mysqlConfig = {
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: { minVersion: "TLSv1.2" }, // conexion cifrada
};
