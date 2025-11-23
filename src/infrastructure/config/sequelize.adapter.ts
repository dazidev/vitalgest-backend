import { config } from "dotenv";
import { Sequelize } from "sequelize";
import "mariadb";

config();

export const sequelize = new Sequelize({
  dialect: "mariadb",
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT_DB ?? 3306),
  database: process.env.DATABASE ?? "test",
  username: process.env.USER_NAME ?? "root",
  password: process.env.PASSWORD ?? "",
  logging: false,
  dialectOptions: {
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
    connectTimeout: 10000,
  },
});
