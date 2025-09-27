"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegationsService = void 0;
const delegations_repositorie_1 = require("../../infrastructure/repositories/delegations.repositorie");
const error_codes_enum_1 = require("../../domain/enums/error-codes.enum");
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
}
exports.DelegationsService = DelegationsService;
