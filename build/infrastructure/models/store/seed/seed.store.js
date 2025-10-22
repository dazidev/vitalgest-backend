"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSMSeed = void 0;
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
const models_store_1 = require("../models.store");
const createSMSeed = async () => {
    let tx;
    try {
        tx = await sequelize_adapter_1.sequelize.transaction();
        //* Estados
        const states = await models_store_1.State.bulkCreate([
            { name: 'Jalisco' },
            { name: 'San Luis Potosí' },
            { name: 'Guanajuato' },
        ]);
        //* Municipios
        states.map(async (state) => {
            if (state.name === 'Jalisco') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'Ameca', state_id: state.id },
                    { name: 'Tala', state_id: state.id },
                    { name: 'Guadalajara', state_id: state.id }
                ]);
            }
            else if (state.name === 'San Luis Potosí') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'San Luis Potosí', state_id: state.id },
                    { name: 'Rio verde', state_id: state.id },
                    { name: 'Matehuala', state_id: state.id }
                ]);
            }
            else if (state.name === 'Guanajuato') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'Leon', state_id: state.id },
                    { name: 'Abasolo', state_id: state.id },
                    { name: 'San Miguel de Allende', state_id: state.id }
                ]);
            }
        });
        await tx.commit();
        return { success: true };
    }
    catch (error) {
        await tx?.rollback();
        return { success: false };
    }
};
exports.createSMSeed = createSMSeed;
