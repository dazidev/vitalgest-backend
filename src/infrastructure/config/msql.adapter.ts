import mysql from 'mysql2/promise';

import { config } from 'dotenv';

config()

export const mysqlConfig: mysql.ConnectionOptions = {
  host: process.env.HOST,
  port: process.env.PORT_DB as unknown as number,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: { minVersion: 'TLSv1.2' }, // conexion cifrada
}

export { mysql }
