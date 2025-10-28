"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeed = void 0;
const sequelize_adapter_1 = require("../../../config/sequelize.adapter");
const models_store_1 = require("../models.store");
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
(0, dotenv_1.config)();
const createSeed = async () => {
    let tx;
    try {
        tx = await sequelize_adapter_1.sequelize.transaction();
        //* Estados
        const states = await models_store_1.State.bulkCreate([
            { name: 'Jalisco' },
            { name: 'San Luis Potosí' },
            { name: 'Guanajuato' },
        ], { transaction: tx });
        //* Municipios
        await states.map(async (state) => {
            if (state.name === 'Jalisco') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'Ameca', state_id: state.id },
                    { name: 'Tala', state_id: state.id },
                    { name: 'Guadalajara', state_id: state.id }
                ], { transaction: tx });
            }
            else if (state.name === 'San Luis Potosí') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'San Luis Potosí', state_id: state.id },
                    { name: 'Rio verde', state_id: state.id },
                    { name: 'Matehuala', state_id: state.id }
                ], { transaction: tx });
            }
            else if (state.name === 'Guanajuato') {
                await models_store_1.Municipality.bulkCreate([
                    { name: 'Leon', state_id: state.id },
                    { name: 'Abasolo', state_id: state.id },
                    { name: 'San Miguel de Allende', state_id: state.id }
                ], { transaction: tx });
            }
        });
        const municipality = await models_store_1.Municipality.findOne({
            where: { name: 'Ameca' },
            transaction: tx,
            include: { model: models_store_1.State, as: 'state', attributes: ['name'] }
        });
        //* Delegacion
        const pharmacy = await models_store_1.Pharmacy.create({}, { transaction: tx });
        const delegation = await models_store_1.Delegation.create({
            state_id: municipality?.state_id,
            name: `Delegación ${municipality?.name}, ${municipality?.state?.name}`,
            municipality_id: municipality?.id,
            pharmacy_id: pharmacy.id,
        }, { transaction: tx });
        //* Usuarios semilla
        const password = await bcrypt_1.default.hash(process.env.USER_PASSWORD_SEED, 10);
        await models_store_1.User.create({
            name: 'Admin',
            lastname: 'Seed',
            email: 'adminseed@vitalgest.mx',
            password: password,
            status: true,
            role: 'general_admin',
            position: 'developer',
            delegation_id: delegation.id,
        }, { transaction: tx });
        await models_store_1.User.create({
            name: 'Jefe Guardia',
            lastname: 'Seed',
            email: 'jefeguardiaseed@vitalgest.mx',
            password: password,
            status: true,
            role: 'head_guard',
            position: 'Jefe de guardia',
            delegation_id: delegation.id,
        }, { transaction: tx });
        await models_store_1.User.create({
            name: 'Paramedico',
            lastname: 'Seed',
            email: 'paramedicoseed@vitalgest.mx',
            password: password,
            status: true,
            role: 'paramedical',
            position: 'Paramedico',
            delegation_id: delegation.id,
        }, { transaction: tx });
        await models_store_1.User.create({
            name: 'Chofer',
            lastname: 'Seed',
            email: 'choferseed@vitalgest.mx',
            password: password,
            status: true,
            role: 'vehicle_operator',
            position: 'Chofer',
            delegation_id: delegation.id,
        }, { transaction: tx });
        //* Ambulancia semilla
        await models_store_1.Ambulance.create({
            number: 'DF434F7',
            model: '2018',
            brand: 'Mercedez Benz',
            delegation_id: delegation.id,
        }, { transaction: tx });
        await tx.commit();
        return { success: true };
    }
    catch (error) {
        await tx?.rollback();
        console.log(error);
        throw { success: false };
    }
};
exports.createSeed = createSeed;
