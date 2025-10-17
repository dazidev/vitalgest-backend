"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardsService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class GuardsService {
    async existsGuard(date, delegationId) {
        // ! todo: lo mas probable es que haya un error con la fecha
        const exists = await infrastructure_1.Guard.findOne({ where: { delegation_id: delegationId, date } });
        if (exists)
            return true;
        return false;
    }
    async createGuard(guardEntityDto) {
        const { guardChief, delegationId, date } = guardEntityDto;
        const existsGuardChief = await infrastructure_1.User.findOne({ where: { id: guardChief, role: 'head_guard' } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsGuardChief)
            throw { code: domain_1.ERROR_CODES.USER_NOT_GUARD_CHIEF };
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        const exists = await this.existsGuard(date, delegationId);
        if (exists)
            throw { code: domain_1.ERROR_CODES.GUARD_ALREADY_EXISTS };
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const guard = await infrastructure_1.Guard.create({
                date: new Date(date), // ! todo: verificar nuevamente el uso de las fechas
                guard_chief: guardChief,
                delegation_id: delegationId,
            });
            await tx.commit();
            return guard;
        }
        catch (error) {
            tx?.rollback();
            throw { code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
    }
    async editGuard(guardEntityDto) {
        const { id, guardChief, delegationId } = guardEntityDto;
        const existsGuardChief = await infrastructure_1.User.findOne({ where: { id: guardChief, role: 'head_guard' } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsGuardChief)
            throw { code: domain_1.ERROR_CODES.USER_NOT_GUARD_CHIEF };
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const guard = await infrastructure_1.Guard.update({
                guard_chief: guardChief,
                delegation_id: delegationId
            }, { where: { id } });
            await tx.commit();
            return guard;
        }
        catch (error) {
            tx?.rollback();
            throw { code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
    }
    async deleteGuard(id) {
        const guard = await infrastructure_1.Guard.destroy({ where: { id } });
        if (guard === 0)
            throw { code: domain_1.ERROR_CODES.GUARD_NOT_FOUND };
        return { success: true };
    }
    async getGuards(amount) {
        let formatAmount;
        if (!(amount === 'all'))
            formatAmount = parseInt(amount);
        else
            formatAmount = amount;
        let guards;
        formatAmount === 'all'
            ? guards = await infrastructure_1.Guard.findAll()
            : guards = await infrastructure_1.Guard.findAll({ limit: formatAmount });
        if (guards.length === 0)
            throw { code: domain_1.ERROR_CODES.GUARD_NOT_FOUND };
        return guards;
    }
    async getOneGuard(id) {
        const guard = await infrastructure_1.Guard.findOne({ where: { id } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!guard)
            throw { code: domain_1.ERROR_CODES.GUARD_NOT_FOUND };
        return guard;
    }
}
exports.GuardsService = GuardsService;
