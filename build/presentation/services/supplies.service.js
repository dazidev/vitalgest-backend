"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliesService = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class SuppliesService {
    async createSupply(supplyEntityDto) {
        const { category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId, } = supplyEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const pharmacy = await infrastructure_1.Pharmacy.findOne({
                where: { id: pharmacyId },
                transaction: tx,
            });
            if (!pharmacy)
                throw domain_1.ERROR_CODES.PHARMACY_NOT_FOUND;
            const supply = await infrastructure_1.Supply.create({
                category: category,
                specification: specification,
                avaible_quantity: Number(avaibleQuantity),
                expiration_date: new Date(expirationDate),
                measurement_unit: measurementUnit,
                pharmacy_id: pharmacyId,
            }, { transaction: tx });
            await tx.commit();
            return {
                success: true,
                data: supply,
            };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async editSupply(supplyEntityDto) {
        const { id, category, specification, avaibleQuantity, expirationDate, measurementUnit, pharmacyId, } = supplyEntityDto;
        let tx;
        try {
            tx = await infrastructure_1.sequelize.transaction();
            const supply = await infrastructure_1.Supply.findOne({ where: { id }, transaction: tx });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            await infrastructure_1.Supply.update({
                category: category,
                specification: specification,
                avaible_quantity: Number(avaibleQuantity),
                expiration_date: expirationDate,
                measurement_unit: measurementUnit,
                pharmacy_id: pharmacyId,
            }, { where: { id }, transaction: tx });
            await tx.commit();
            return { success: true };
        }
        catch (error) {
            await tx?.rollback();
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async deleteSupply(supplyEntityDto) {
        const { id } = supplyEntityDto;
        try {
            const supply = await infrastructure_1.Supply.findOne({
                where: { id },
            });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            const row = await infrastructure_1.Supply.destroy({ where: { id } });
            if (row === 0)
                throw domain_1.ERROR_CODES.SUPPLY_NOT_FOUND;
            return { success: true };
        }
        catch (error) {
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    //! falta hacer uno por todos
    async getSupplies(pharmacyId) {
        try {
            const pharmacy = infrastructure_1.Pharmacy.findOne({ where: { id: pharmacyId } });
            if (!pharmacy)
                throw domain_1.ERROR_CODES.PHARMACY_NOT_FOUND;
            const supplies = await infrastructure_1.Supply.findAll({
                where: { pharmacy_id: pharmacyId },
            });
            if (supplies.length === 0)
                throw domain_1.ERROR_CODES.SUPPLIES_NOT_FOUND;
            return {
                success: true,
                data: supplies,
            };
        }
        catch (error) {
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
    async getOneSupply(id) {
        try {
            const supply = await infrastructure_1.Supply.findOne({ where: { id } });
            if (!supply)
                throw domain_1.ERROR_CODES.SUPPLIES_NOT_FOUND;
            return {
                success: true,
                data: supply,
            };
        }
        catch (error) {
            if (typeof error === "string")
                throw error;
            throw domain_1.ERROR_CODES.UNKNOWN_DB_ERROR;
        }
    }
}
exports.SuppliesService = SuppliesService;
