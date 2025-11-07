"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsService = void 0;
const error_codes_enum_1 = require("../../domain/enums/error-codes.enum");
const infrastructure_1 = require("../../infrastructure");
class DelegationsService {
    async getStates() {
        const states = await infrastructure_1.State.findAll()
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (states.length === 0)
            throw error_codes_enum_1.ERROR_CODES.STATES_NOT_FOUND;
        const results = await Promise.all(states.map(async (state) => {
            const municipalities = await infrastructure_1.Municipality.findAll({
                where: { state_id: state.id },
                attributes: ['id', 'name'],
                order: [['name', 'ASC']],
            });
            return {
                id: state.id,
                name: state.name,
                municipalities: municipalities, // opcional
            };
        }));
        return {
            success: true,
            data: results ? results : states
        };
    }
    async getMunicipalities(state) {
        const exists = await infrastructure_1.State.findOne({ where: { id: state } })
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!exists)
            throw error_codes_enum_1.ERROR_CODES.STATE_NOT_FOUND;
        const municipalities = await infrastructure_1.Municipality.findAll({ where: { state_id: state } })
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (municipalities.length === 0)
            throw error_codes_enum_1.ERROR_CODES.MUNICIPALITIES_NOT_FOUND;
        const formatMunicipalities = municipalities.map((m) => ({
            id: m.id,
            name: m.name,
            state: {
                id: m.state_id
            }
        }));
        return formatMunicipalities;
    }
    async createDelegation(delegationEntity) {
        const { name, stateName, municipalityId, municipalityName } = delegationEntity;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const delegation = await infrastructure_1.Delegation.create({
                name: name,
                municipality_id: municipalityId
            }, { transaction: tx });
            const pharmacy = await infrastructure_1.Pharmacy.create({
                delegation_id: delegation.id
            }, { transaction: tx });
            await tx.commit();
            const formatDelegation = {
                id: delegation.id,
                name: delegation.name,
                state: {
                    name: stateName,
                },
                municipality: {
                    id: delegation.municipality_id,
                    name: municipalityName
                },
                pharmacy: {
                    id: pharmacy.id,
                },
                createdAt: delegation.get('createdAt'),
                updatedAt: delegation.get('updatedAt'),
            };
            return {
                success: true,
                data: formatDelegation
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw error_codes_enum_1.ERROR_CODES.INSERT_FAILED;
        }
    }
    async editDelegation(delegationEntity) {
        const { id, name, municipalityId } = delegationEntity;
        const exists = await infrastructure_1.Delegation.findOne({ where: { id } })
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!exists)
            throw error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND;
        const existsMunicipality = await infrastructure_1.Municipality.findOne({ where: { id } })
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!existsMunicipality)
            throw error_codes_enum_1.ERROR_CODES.MUNICIPALITY_NOT_FOUND;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const delegation = await infrastructure_1.Delegation.update({
                name: name,
                municipality_id: municipalityId
            }, { where: { id }, transaction: tx });
            await tx.commit();
            if (!delegation)
                throw error_codes_enum_1.ERROR_CODES.UPDATE_FAILED;
            return {
                success: true
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw error_codes_enum_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async deleteDelegation(id) {
        //! todo: eliminar luego todo lo vinculado con la farmacia y delegación.
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            await infrastructure_1.Delegation.findByPk(id, {
                include: [{ model: infrastructure_1.Pharmacy, as: 'pharmacy', attributes: ['id'] }],
                transaction: tx,
                lock: tx.LOCK.UPDATE,
            });
            const count = await infrastructure_1.Delegation.destroy({ where: { id }, transaction: tx });
            await infrastructure_1.Pharmacy.destroy({ where: { id }, transaction: tx });
            if (count === 0)
                throw error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND;
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw error_codes_enum_1.ERROR_CODES.DELETE_FAILED;
        }
    }
    async getDelegations(amount) {
        let newAmount;
        if (amount !== 'all')
            newAmount = parseInt(amount);
        else
            newAmount = amount;
        let delegations;
        newAmount === 'all'
            ? delegations = await infrastructure_1.Delegation.findAll({
                include: [
                    { model: infrastructure_1.Municipality, as: 'municipality', attributes: ['id', 'name'] },
                    { model: infrastructure_1.Pharmacy, as: 'pharmacy', attributes: ['id'] }
                ],
                attributes: {
                    exclude: ['municipality_id', 'pharmacy_id']
                }
            })
            : delegations = await infrastructure_1.Delegation.findAll({
                include: [
                    { model: infrastructure_1.Municipality, as: 'municipality', attributes: ['id', 'name'] },
                    { model: infrastructure_1.Pharmacy, as: 'pharmacy', attributes: ['id'] }
                ],
                attributes: {
                    exclude: ['municipality_id', 'pharmacy_id']
                },
                limit: newAmount
            });
        if (delegations.length === 0)
            throw error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND;
        const formatDelegations = delegations.map((delegation) => ({
            id: delegation.id,
            name: delegation.name,
            municipality: delegation.municipality,
            createdAt: delegation.get('createdAt'),
            updatedAt: delegation.get('updatedAt'),
        }));
        return {
            success: true,
            data: formatDelegations
        };
    }
    async getDelegation(id) {
        const delegation = await infrastructure_1.Delegation.findOne({
            where: { id },
            include: [
                { model: infrastructure_1.Municipality, as: 'municipality', attributes: ['id', 'name'] },
                { model: infrastructure_1.Pharmacy, as: 'pharmacy', attributes: ['id'] }
            ],
            attributes: {
                exclude: ['municipality_id', 'pharmacy_id']
            }
        })
            .catch((_error) => { throw error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!delegation)
            throw error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND;
        const formatDelegation = {
            id: delegation.id,
            name: delegation.name,
            municipality: delegation.municipality,
            createdAt: delegation.get('createdAt'),
            updatedAt: delegation.get('updatedAt'),
        };
        return {
            success: true,
            data: formatDelegation
        };
    }
}
exports.DelegationsService = DelegationsService;
