"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infrastructure_1 = require("../infrastructure");
require("../infrastructure/models/index"); // importa todos tus modelos
// o un index que importe todos
async function run() {
    await infrastructure_1.sequelize.authenticate();
    await infrastructure_1.sequelize.drop();
    await infrastructure_1.sequelize.sync({ force: true });
    console.log('Sync OK');
    await infrastructure_1.sequelize.close();
}
run().catch((e) => { console.error(e); process.exit(1); });
//await sequelize.sync({ alter: true }); // en dev; en prod evita alter
