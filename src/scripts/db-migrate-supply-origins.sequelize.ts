import path from "node:path";
import * as Sequelize from "sequelize";
import { sequelize } from "../infrastructure/config/sequelize.adapter";

async function run() {
  try {
    await sequelize.authenticate();
    const migration = require(path.resolve(
      "src/infrastructure/models/store/sequelize/client/migrations/20261119000000-add-supply-origin-references.js",
    ));
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    console.log("Referencias de origen agregadas sin borrar datos ni modificar existencias.");
  } finally {
    await sequelize.close();
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : "Error de migración");
  process.exitCode = 1;
});
