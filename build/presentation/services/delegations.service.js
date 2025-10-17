"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsService = void 0;
const error_codes_enum_1 = require("../../domain/enums/error-codes.enum");
const infrastructure_1 = require("../../infrastructure");
const pharmacy_model_store_1 = __importDefault(require("../../infrastructure/models/store/sequelize/pharmacy-model.store"));
const delegation_model_store_1 = __importDefault(require("../../infrastructure/models/store/sequelize/delegation-model.store"));
class DelegationsService {
    async getStates() {
        const states = await infrastructure_1.State.findAll()
            .catch(() => { throw { code: error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (states.length === 0)
            throw { code: error_codes_enum_1.ERROR_CODES.STATES_NOT_FOUND };
        return states;
    }
    async getMunicipalities(state) {
        const exists = await infrastructure_1.State.findOne({ where: { id: state } })
            .catch(() => { throw { code: error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!exists)
            throw { code: error_codes_enum_1.ERROR_CODES.STATE_NOT_FOUND };
        const municipalities = await infrastructure_1.Municipality.findAll({ where: { state_id: state } })
            .catch(() => { throw { code: error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (municipalities.length === 0)
            throw { code: error_codes_enum_1.ERROR_CODES.MUNICIPALITIES_NOT_FOUND };
        return municipalities;
    }
    async createDelegation(delegationEntity) {
        const { name, stateId, municipalityId } = delegationEntity;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const pharmacy = await pharmacy_model_store_1.default.create();
            const delegation = await delegation_model_store_1.default.create({
                name: name,
                state_id: stateId,
                municipality_id: municipalityId,
                pharmacy_id: pharmacy.id
            });
            await tx.commit();
            return delegation;
        }
        catch (error) {
            await tx?.rollback();
            throw { code: error_codes_enum_1.ERROR_CODES.INSERT_FAILED };
        }
    }
    async editDelegation(delegationEntity) {
        const { id, name, stateId, municipalityId } = delegationEntity;
        const exists = await delegation_model_store_1.default.findOne({ where: { id } })
            .catch(() => { throw { code: error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!exists)
            throw { code: error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const delegation = await delegation_model_store_1.default.update({
                name: name,
                state_id: stateId,
                municipality_id: municipalityId
            }, { where: { id } });
            await tx.commit();
            return delegation;
        }
        catch (error) {
            await tx?.rollback();
            throw { code: error_codes_enum_1.ERROR_CODES.UPDATE_FAILED };
        }
    }
    async deleteDelegation(id) {
        // todo: eliminar luego todo lo vinculado con la farmacia y delegación.
        const count = await delegation_model_store_1.default.destroy({ where: { id } });
        if (count === 0)
            throw { code: error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        return { success: true };
    }
    async getDelegations(amount) {
        let newAmount;
        if (amount !== 'all')
            newAmount = parseInt(amount);
        else
            newAmount = amount;
        let delegations;
        newAmount === 'all'
            ? delegations = await delegation_model_store_1.default.findAll()
            : delegations = await delegation_model_store_1.default.findAll({ limit: newAmount });
        if (delegations.length === 0)
            throw { code: error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        return delegations;
    }
    async getDelegation(id) {
        const delegation = await delegation_model_store_1.default.findOne({ where: { id } })
            .catch(() => { throw { code: error_codes_enum_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!delegation)
            throw { code: error_codes_enum_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        return delegation;
    }
}
exports.DelegationsService = DelegationsService;
