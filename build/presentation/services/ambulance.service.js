"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulancesService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class AmbulancesService {
    async createAmbulance(ambulanceEntityDto) {
        const { delegationId, number } = ambulanceEntityDto;
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        const exists = await infrastructure_1.Ambulance.findOne({ where: { number: number } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (exists)
            throw { code: 'AMBULANCE_EXISTS' };
        const ambulanceEntity = domain_1.AmbulanceEntity.create(ambulanceEntityDto);
        if (!ambulanceEntity)
            throw { code: domain_1.ERROR_CODES.INSERT_FAILED };
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const ambulance = await infrastructure_1.Ambulance.create({
                number: ambulanceEntity.number,
                brand: ambulanceEntity.brand,
                model: ambulanceEntity.model,
                delegation_id: ambulanceEntity.delegationId,
            });
            await tx.commit();
            const formatAmbulance = {
                id: ambulance.id,
                number: ambulance.number,
                brand: ambulance.brand,
                model: ambulance.model,
                delegation: {
                    id: ambulance.delegation_id
                }
            };
            return {
                success: true,
                data: formatAmbulance
            };
        }
        catch (error) {
            tx?.rollback();
            throw { code: domain_1.ERROR_CODES.INSERT_FAILED };
        }
    }
    async editAmbulance(ambulanceEntityDto) {
        const { id, delegationId } = ambulanceEntityDto;
        const exists = await infrastructure_1.Ambulance.findOne({ where: { id } });
        if (!exists)
            throw { code: domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND };
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!existsDelegation)
            throw { code: domain_1.ERROR_CODES.DELEGATION_NOT_FOUND };
        const ambulanceEntity = domain_1.AmbulanceEntity.edit(ambulanceEntityDto);
        if (!ambulanceEntity)
            throw { code: domain_1.ERROR_CODES.UPDATE_FAILED };
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            await infrastructure_1.Ambulance.update({
                number: ambulanceEntity.number,
                brand: ambulanceEntity.brand,
                model: ambulanceEntity.model,
                delegation_id: ambulanceEntity.delegationId,
            }, { where: { id } });
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            tx?.rollback();
            throw { code: domain_1.ERROR_CODES.UPDATE_FAILED };
        }
    }
    async deleteAmbulance(ambulanceEntityDto) {
        const { id } = ambulanceEntityDto;
        const ambulance = await infrastructure_1.Ambulance.destroy({ where: { id } });
        if (ambulance === 0)
            throw { code: domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND };
        return { success: true };
    }
    async getAmbulances(amount) {
        let formatAmount;
        if (!(amount === 'all'))
            formatAmount = parseInt(amount);
        else
            formatAmount = amount;
        let ambulances;
        formatAmount === 'all'
            ? ambulances = await infrastructure_1.Ambulance.findAll({
                include: [
                    { model: infrastructure_1.Delegation, as: 'delegation', attributes: ['id', 'name'] },
                ],
            })
            : ambulances = await infrastructure_1.Ambulance.findAll({
                include: [
                    { model: infrastructure_1.Delegation, as: 'delegation', attributes: ['id', 'name'] },
                ],
                limit: formatAmount
            });
        if (ambulances.length === 0)
            throw { code: domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND };
        const formatAmbulances = ambulances.map((ambulance) => ({
            id: ambulance.id,
            number: ambulance.number,
            brand: ambulance.brand,
            model: ambulance.model,
            delegation: {
                id: ambulance.delegation?.id,
                name: ambulance.delegation?.name,
            }
        }));
        return {
            success: true,
            data: formatAmbulances
        };
    }
    async getOneAmbulance(id) {
        const ambulance = await infrastructure_1.Ambulance.findOne({
            where: { id },
            include: [
                { model: infrastructure_1.Delegation, as: 'delegation', attributes: ['id', 'name'] },
            ],
        })
            .catch(() => { throw { code: domain_1.ERROR_CODES.UNKNOWN_DB_ERROR }; });
        if (!ambulance)
            throw { code: domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND };
        const formatAmbulance = {
            id: ambulance.id,
            number: ambulance.number,
            brand: ambulance.brand,
            model: ambulance.model,
            delegation: {
                id: ambulance.delegation?.id,
                name: ambulance.delegation?.name,
            }
        };
        return {
            success: true,
            data: formatAmbulance
        };
    }
}
exports.AmbulancesService = AmbulancesService;
