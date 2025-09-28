"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsService = void 0;
const delegations_repositorie_1 = require("../../infrastructure/repositories/delegations.repositorie");
const error_codes_enum_1 = require("../../domain/enums/error-codes.enum");
const uuid_1 = require("uuid");
class DelegationsService {
    constructor() {
        this.delegationsRepo = new delegations_repositorie_1.DelegationsRepositorie();
    }
    async getStates() {
        const states = await this.delegationsRepo.getStates();
        if (!states.success)
            throw { code: states.code };
        if (Array.isArray(states.data)) {
            if (states.data.length === 0)
                throw { code: error_codes_enum_1.ERROR_CODES.STATES_NOT_FOUND };
        }
        return states;
    }
    async getMunicipalities(state) {
        const exists = await this.delegationsRepo.stateExists(state);
        if (!exists)
            throw { code: error_codes_enum_1.ERROR_CODES.STATE_NOT_FOUND };
        const municipalities = await this.delegationsRepo.getMunicipalities(state);
        if (!municipalities.success)
            throw { code: municipalities.code };
        if (Array.isArray(municipalities.data)) {
            if (municipalities.data.length === 0)
                throw { code: error_codes_enum_1.ERROR_CODES.MUNICIPALITIES_NOT_FOUND };
        }
        return municipalities;
    }
    async createDelegation(delegationEntity) {
        const id = (0, uuid_1.v4)();
        const pharmacy = await this.delegationsRepo.createPharmacy(id);
        if (!pharmacy.success)
            throw { code: pharmacy.code };
        const pharmacyId = pharmacy.pharmacyId;
        const delegation = await this.delegationsRepo.createDelegation({ ...delegationEntity, pharmacyId });
        if (!delegation.success)
            throw { code: delegation.code };
        // todo: eliminar la farmacia si hay algun problema al crear la delegación
        return delegation;
    }
    async editDelegation(delegationEntity) {
        const delegation = await this.delegationsRepo.editDelegation(delegationEntity);
        if (!delegation.success)
            throw { code: delegation.code };
        return delegation;
    }
    async deleteDelegation(delegationId) {
        // todo: eliminar farmacia también, luego todo lo vinculado con la farmacia y delegación.
        const delegation = await this.delegationsRepo.deleteDelegation(delegationId);
        if (!delegation.success)
            throw { code: delegation.code };
        return delegation;
    }
    async getDelegations(amount) {
        let newAmount;
        if (amount !== 'all')
            newAmount = parseInt(amount);
        else
            newAmount = amount;
        const delegation = await this.delegationsRepo.getDelegations(newAmount);
        if (!delegation.success)
            throw { code: delegation.code };
        return delegation;
    }
    async getDelegation(delegationId) {
        const delegation = await this.delegationsRepo.getDelegation(delegationId);
        if (!delegation.success)
            throw { code: delegation.code };
        return delegation;
    }
}
exports.DelegationsService = DelegationsService;
