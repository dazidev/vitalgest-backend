"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
require("mariadb");
(0, dotenv_1.config)();
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'mariadb',
    host: process.env.HOST ?? '127.0.0.1',
    port: Number(process.env.PORT_DB ?? 3306),
    database: process.env.DATABASE ?? 'test',
    username: process.env.USER_NAME ?? 'root',
    password: process.env.PASSWORD ?? '',
    logging: false,
    dialectOptions: {
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
        },
    }
});
