"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulancesService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class AmbulancesService {
    async createAmbulance(ambulanceEntityDto) {
        const { delegationId, number } = ambulanceEntityDto;
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!existsDelegation)
            throw domain_1.ERROR_CODES.DELEGATION_NOT_FOUND;
        const exists = await infrastructure_1.Ambulance.findOne({ where: { number: number } })
            .catch(() => { throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (exists)
            throw 'AMBULANCE_EXISTS';
        const ambulanceEntity = domain_1.AmbulanceEntity.create(ambulanceEntityDto);
        if (!ambulanceEntity)
            throw domain_1.ERROR_CODES.INSERT_FAILED;
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
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.INSERT_FAILED;
        }
    }
    async editAmbulance(ambulanceEntityDto) {
        const { id, delegationId } = ambulanceEntityDto;
        const exists = await infrastructure_1.Ambulance.findOne({ where: { id } });
        if (!exists)
            throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
        const existsDelegation = await infrastructure_1.Delegation.findOne({ where: { id: delegationId } })
            .catch(() => { throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!existsDelegation)
            throw domain_1.ERROR_CODES.DELEGATION_NOT_FOUND;
        const ambulanceEntity = domain_1.AmbulanceEntity.edit(ambulanceEntityDto);
        if (!ambulanceEntity)
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
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
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UPDATE_FAILED;
        }
    }
    async deleteAmbulance(ambulanceEntityDto) {
        const { id } = ambulanceEntityDto;
        const ambulance = await infrastructure_1.Ambulance.destroy({ where: { id } });
        if (ambulance === 0)
            throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
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
            throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
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
            .catch(() => { throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR; });
        if (!ambulance)
            throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
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
    async addSupply(supplyAmbEntityDto) {
        const { avaibleQuantity, minQuantity, areaId, ambulanceId, supplyId } = supplyAmbEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const supplyInfo = await infrastructure_1.Supply.findOne({ where: { id: supplyId }, transaction: tx });
            if (!supplyInfo)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            if (avaibleQuantity > supplyInfo.avaible_quantity)
                throw domain_1.ERROR_CODES.QUANTITY_NOT_EXIST;
            const newQuantity = supplyInfo.avaible_quantity - avaibleQuantity;
            await infrastructure_1.Supply.update({
                avaible_quantity: newQuantity,
            }, { where: { id: supplyId }, transaction: tx });
            const supplyAmb = await infrastructure_1.SupplyAmbulance.create({
                category: supplyInfo.category,
                specification: supplyInfo.specification,
                avaible_quantity: avaibleQuantity,
                min_quantity: minQuantity,
                expiration_date: supplyInfo.expiration_date,
                measurement_unit: supplyInfo.measurement_unit,
                area_id: areaId, //! todo: hacer la tabla de areas
                ambulance_id: ambulanceId,
            }, { transaction: tx });
            await tx.commit();
            return {
                success: true,
                data: supplyAmb
            };
        }
        catch (error) {
            tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async editSupply(supplyAmbEntityDto) {
        const { id, avaibleQuantity, minQuantity, areaId, ambulanceId } = supplyAmbEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const supply = await infrastructure_1.SupplyAmbulance.findOne({ where: { id }, transaction: tx });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            await infrastructure_1.SupplyAmbulance.update({
                avaible_quantity: avaibleQuantity,
                min_quantity: minQuantity,
                area_id: areaId, //! todo: hacer la tabla de areas
                ambulance_id: ambulanceId,
            }, { where: { id }, transaction: tx });
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async deleteSupply(supplyAmbEntityDto) {
        const { id } = supplyAmbEntityDto;
        try {
            const supply = await infrastructure_1.SupplyAmbulance.findOne({
                where: { id }
            });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            const row = await infrastructure_1.SupplyAmbulance.destroy({ where: { id } });
            if (row === 0)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            return { success: true };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async getAmbSupplies(ambulanceId) {
        try {
            const pharmacy = infrastructure_1.Ambulance.findOne({ where: { id: ambulanceId } });
            if (!pharmacy)
                throw domain_1.ERROR_CODES.AMBULANCE_NOT_FOUND;
            const supplies = await infrastructure_1.SupplyAmbulance.findAll({ where: { ambulance_id: ambulanceId } });
            if (supplies.length === 0)
                throw domain_1.ERROR_CODES.SUPPLIES_NOT_FOUND;
            return {
                success: true,
                data: supplies
            };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async getOneAmbSupply(supplyAmbEntityDto) {
        const { id } = supplyAmbEntityDto;
        try {
            const supply = await infrastructure_1.SupplyAmbulance.findOne({ where: { id } });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLIES_NOT_FOUND;
            return {
                success: true,
                data: supply
            };
        }
        catch (error) {
            if (typeof error === 'string')
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
}
exports.AmbulancesService = AmbulancesService;
