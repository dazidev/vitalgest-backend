import { sequelize, createSeed, createQuestionsSeed } from "../infrastructure";

async function run() {
  try {
    await sequelize.authenticate();
    if (!process.env.USER_PASSWORD_SEED) throw new Error("Falta USER_PASSWORD_SEED");
    const initial = await createSeed();
    await createQuestionsSeed(initial.delegationId);
    console.log("Semillas general y de preguntas cargadas en la delegación inicial.");
  } finally {
    await sequelize.close();
  }
}

run().catch(() => {
  console.error("No se pudieron cargar las semillas. Revisa la conexión y que la base esté vacía.");
  process.exitCode = 1;
});
