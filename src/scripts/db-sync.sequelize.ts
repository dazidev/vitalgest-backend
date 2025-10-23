import { sequelize } from '../infrastructure';
import '../infrastructure/models/index'; // importa todos tus modelos
// o un index que importe todos

async function run() {
  await sequelize.authenticate();
  //await sequelize.sync({ alter: true }); // en dev; en prod evita alter
  await sequelize.sync({ force: true });
  console.log('Sync OK');
  await sequelize.close();
}
run().catch((e) => { console.error(e); process.exit(1); });
