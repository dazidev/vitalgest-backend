import { sequelize } from "../infrastructure";
import "../infrastructure/models/index";

async function run() {
  try {
    if (!process.env.DATABASE) throw new Error("Falta DATABASE");
    await sequelize.authenticate();
    await sequelize.drop();
    await sequelize.sync({ force: true });
    console.log(`Esquema reconstruido: ${process.env.DATABASE}`);
  } finally {
    await sequelize.close();
  }
}
run().catch((e) => {
  console.error(e instanceof Error ? `${e.name}: ${e.message}` : "Error de sincronización");
  process.exit(1);
});

//await sequelize.sync({ alter: true }); // en dev; en prod evita alter
