"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class GuardsService {
    constructor() {
        this.guardsRepo = new infrastructure_1.GuardsRepositorie();
    }
    async existsGuard(date, delegationId) {
        const exists = await this.guardsRepo.existsGuard(date, delegationId);
        if (exists)
            return true;
        return false;
    }
    async createGuard(guardEntityDto) {
        const { guardChief, delegationId, date } = guardEntityDto;
        const existsGuardChief = await this.guardsRepo.isGuardChief(guardChief);
        if (!existsGuardChief)
            throw { code: domain_1.ERROR_CODES.USER_NOT_GUARD_CHIEF };
        const existsDelegation = await this.guardsRepo.existsDelegation(delegationId);
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        const exists = await this.existsGuard(date, delegationId);
        if (exists)
            throw { code: domain_1.ERROR_CODES.GUARD_ALREADY_EXISTS };
        const guard = await this.guardsRepo.createGuard(guardEntityDto);
        if (!guard.success)
            throw { code: guard.code };
        return guard;
    }
    async editGuard(guardEntityDto) {
        const { guardChief, delegationId } = guardEntityDto;
        const existsGuardChief = await this.guardsRepo.isGuardChief(guardChief);
        if (!existsGuardChief)
            throw { code: domain_1.ERROR_CODES.USER_NOT_GUARD_CHIEF };
        const existsDelegation = await this.guardsRepo.existsDelegation(delegationId);
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        const guard = await this.guardsRepo.editGuard(guardEntityDto);
        if (!guard.success)
            throw { code: guard.code };
        return guard;
    }
    async deleteGuard(id) {
        const guard = await this.guardsRepo.deleteGuard(id);
        if (!guard.success)
            throw { code: guard.code };
        return guard;
    }
    async getGuards(amount) {
        let formatAmount;
        if (!(amount === 'all'))
            formatAmount = parseInt(amount);
        else
            formatAmount = amount;
        const guards = await this.guardsRepo.getGuards(formatAmount);
        if (!guards.success)
            return { code: guards.code }; // todo: revisar porque no se envia el success: false
        return guards;
    }
    async getOneGuard(id) {
        const guard = await this.guardsRepo.getOneGuard(id);
        if (!guard.success)
            throw { code: guard.code };
        return guard;
    }
}
exports.GuardsService = GuardsService;
